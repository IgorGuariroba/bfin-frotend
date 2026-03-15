# Correção Final - Reatividade do CalendarWidget

## Problema Identificado

O usuário corretamente identificou que a solução anterior não funcionava porque:

> "O que é exibido para o usuário no próximos vencimentos vem do transactions?startDate... está atualizando um campo que não fica visível para o usuario."

### Análise do Fluxo Real

```tsx
// CalendarWidget.tsx - O que realmente exibe os dados
function useUpcomingEvents() {
  return useQuery({
    queryKey: ['upcoming-events', format(today, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await transactionService.list({
        startDate: today.toISOString(),
        endDate: next7Days.toISOString(),
      })
      return transformTransactionsToEvents(response.transactions)
    }
  })
}
```

**Problema:** A query `['upcoming-events']` NÃO era invalidada quando uma transação era criada!

---

## Causa Raiz

O `invalidateTransactionRelatedQueries()` invalidava apenas:
- `['transactions']` ❌
- `['accounts']` ❌
- `['calendar-events']` ❌

Mas **NÃO** invalidava:
- `['upcoming-events']` ❌ ← Era essa a query do CalendarWidget!

---

## Solução Correta

### Adicionar `['upcoming-events']` à Invalidação

```tsx
// useCacheInvalidation.ts
const invalidateTransactionRelatedQueries = async () => {
  // Queries de transações (todas as variações de params)
  await queryClient.invalidateQueries({ 
    queryKey: ['transactions'],
    exact: false,
  });

  // ✅ Query específica de upcoming-events do CalendarWidget
  await queryClient.invalidateQueries({ 
    queryKey: ['upcoming-events'],
    exact: false,
  });

  // ... resto das invalidações
}
```

### Por Que `exact: false`?

```tsx
// Query key real: ['upcoming-events', '2026-03-15']
// Com exact: false → Invalida TODAS que começam com ['upcoming-events']

queryClient.invalidateQueries({ 
  queryKey: ['upcoming-events'],
  exact: false, // ← Isso é crucial!
});
```

Sem `exact: false`, apenas `['upcoming-events']` (sem data) seria invalidado, mas a query real é `['upcoming-events', '2026-03-15']`.

---

## Fluxo Correto Agora

```
┌─────────────────────────────────────────────────────────────┐
│  1. Usuário cria despesa no ExpenseForm                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. useCreateExpense.mutateAsync()                          │
│     onSuccess: invalidateTransactionRelatedQueries()        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. invalidateTransactionRelatedQueries() invalida:        │
│     - ['transactions']                                      │
│     - ['upcoming-events'] ✅ (NOVO!)                        │
│     - ['calendar-events']                                   │
│     - ['accounts']                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. React Query detecta que ['upcoming-events'] é stale    │
│     e faz refetch automático                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. useUpcomingEvents() busca dados atualizados da API     │
│     transactionService.list({ startDate, endDate })         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  6. CalendarWidget re-renderiza com novos eventos          │
│     "Próximos vencimentos" atualizado! ✨                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Mudanças nos Arquivos

### `src/hooks/useCacheInvalidation.ts`

```diff
const invalidateTransactionRelatedQueries = async () => {
+  // Queries de transações (todas as variações de params)
+  await queryClient.invalidateQueries({ 
+    queryKey: ['transactions'],
+    exact: false,
+  });
+
+  // ✅ Query específica de upcoming-events do CalendarWidget
+  await queryClient.invalidateQueries({ 
+    queryKey: ['upcoming-events'],
+    exact: false,
+  });

   // Invalidação robusta para accounts do SDK
   await queryClient.invalidateQueries({ predicate: ... });

   // Queries tradicionais de accounts
   await queryClient.invalidateQueries({ queryKey: ['accounts'] });

+  // Queries de eventos do calendário
+  await queryClient.invalidateQueries({ 
+    queryKey: ['calendar-events'],
+    exact: false,
+  });
};
```

### `src/hooks/useCalendar.ts`

Removido código redundante de subscriber (agora a invalidação é centralizada):

```diff
- const invalidateOnTransactionChange = useCallback(() => {
-   queryClient.invalidateQueries({ queryKey: ['calendar-events'] })
- }, [queryClient])

- useMemo(() => {
-   const subscription = queryClient.getQueryCache().subscribe((event) => {
-     if (event.query.queryKey[0] === 'transactions') {
-       invalidateOnTransactionChange()
-     }
-   })
-   return () => subscription()
- }, [queryClient, invalidateOnTransactionChange])
```

---

## Por Que Esta Solução Funciona

| Característica | Explicação |
|----------------|------------|
| **Invalidação Direta** | `['upcoming-events']` é explicitamente invalidado |
| **exact: false** | Pega TODAS as variações da query key (com datas) |
| **Centralizada** | Uma única função invalida tudo que é relacionado |
| **React Query** | Faz o refetch automático quando query é stale |
| **Reatividade** | Componente re-renderiza quando dados chegam |

---

## Testes para Validar

### Teste 1: Criar Despesa Fixa Futura
```
1. Ir em "Pagar" (Nova Despesa)
2. Criar despesa com vencimento em 3 dias
3. Voltar ao Dashboard
4. ✅ "Próximos vencimentos" deve mostrar a nova despesa
```

### Teste 2: Criar Receita
```
1. Ir em "Depositar"
2. Criar receita com data de hoje
3. ✅ "Próximos vencimentos" deve mostrar "+ R$ XXX"
```

### Teste 3: Pagar Despesa
```
1. No CalendarWidget, clicar em "Pagar" em uma despesa pendente
2. ✅ Status deve mudar para "Pago" (badge verde)
3. ✅ Botão "Pagar" deve desaparecer
```

### Teste 4: Múltiplas Atualizações
```
1. Criar 3 despesas em dias diferentes
2. Criar 1 receita
3. Pagar 1 despesa
4. ✅ Tudo deve atualizar sem reload da página
```

---

## Lição Aprendida

### Problema das Soluções Anteriores

1. **Subscriber no useCalendar** → Complexo e redundante
2. **Refetch manual** → Não cobria todos os casos
3. **Query keys diferentes** → Fácil esquecer de invalidar alguma

### Padrão Correto

```tsx
// ✅ Sempre invalidar TODAS as query keys relacionadas
const invalidateTransactionRelatedQueries = async () => {
  await queryClient.invalidateQueries({ 
    queryKey: ['transactions'], 
    exact: false 
  });
  await queryClient.invalidateQueries({ 
    queryKey: ['upcoming-events'], // ← Específica do CalendarWidget
    exact: false 
  });
  await queryClient.invalidateQueries({ 
    queryKey: ['calendar-events'], 
    exact: false 
  });
  // ...
};
```

### Regra de Ouro

> **Sempre que criar uma NOVA query key, adicionar à invalidação centralizada!**

---

## Conclusão

A correção foi **simples e direta**:
- Adicionar `['upcoming-events']` à lista de queries invalidadas
- Usar `exact: false` para pegar todas as variações
- Manter invalidação centralizada (single source of truth)

Resultado: **"Próximos vencimentos" agora atualiza automaticamente** quando transações são criadas/editadas/pagas.
