# CalendarWidget - Reatividade de Próximos Vencimentos

## Problema

A seção "Próximos vencimentos" no `CalendarWidget` não atualizava automaticamente quando uma nova despesa ou receita era criada. O usuário precisava recarregar a página para ver as mudanças.

### Causa Raiz

O `CalendarWidget` usava o hook `useCalendar` que:
1. Busca apenas eventos do **mês atual**
2. Não tinha mecanismo de escuta para mudanças nas dados de transações
3. Os dados só atualizavam quando o cache expirava (`staleTime: 5 minutos`)

```tsx
// ❌ ANTES - Dados só do mês atual
const calendar = useCalendar(new Date(), {})
const upcomingEvents = getUpcomingEvents() // Derivado do mês atual
```

---

## Solução Implementada

### 1. Hook Dedicado para Próximos 7 Dias

Criado `useUpcomingEvents()` - um hook específico que:
- Busca transações dos **próximos 7 dias**
- Tem `staleTime` curto (2 minutos)
- Faz **refetch automático** a cada 5 minutos
- Reage automaticamente a invalidações de cache

```tsx
// ✅ DEPOIS - Hook dedicado com refetch automático
function useUpcomingEvents() {
  return useQuery({
    queryKey: ['upcoming-events', format(today, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await transactionService.list({
        startDate: today.toISOString(),
        endDate: next7Days.toISOString(),
      })
      return transformTransactionsToEvents(response.transactions)
    },
    staleTime: 1000 * 60 * 2,      // 2 minutos
    refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
  })
}
```

### 2. Escuta de Mudanças no Cache

Adicionado no `useCalendar.ts` um subscriber que:
- Monitora mudanças na query `['transactions']`
- Invalida automaticamente `['calendar-events']` quando transações mudam
- Garante que o calendário atualize sem necessidade de reload

```tsx
// useCalendar.ts
useMemo(() => {
  const subscription = queryClient.getQueryCache().subscribe((event) => {
    if (event.query.queryKey[0] === 'transactions') {
      invalidateOnTransactionChange() // Invalida calendar-events
    }
  })
  return () => subscription()
}, [queryClient, invalidateOnTransactionChange])
```

---

## Fluxo de Atualização

```
┌──────────────────────────────────────────────────────────────┐
│  1. Usuário cria despesa/receita no ExpenseForm/IncomeForm  │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────┐
│  2. useCreateExpense/useCreateIncome muta transação         │
│     - onSuccess: invalidateTransactionRelatedQueries()       │
│     - refetchAccounts()                                      │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────┐
│  3. Query Cache do React Query detecta mudança em           │
│     ['transactions']                                         │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────┐
│  4. Subscriber no useCalendar.ts recebe notificação         │
│     - Chama invalidateOnTransactionChange()                  │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────┐
│  5. Query ['calendar-events'] é invalidada                  │
│     - Refetch automático                                     │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────────┐
│  6. CalendarWidget re-renderiza com novos eventos           │
│     - UI atualiza instantaneamente                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Benefícios

| Antes | Depois |
|-------|--------|
| Atualizava apenas no reload | Atualiza automaticamente |
| Dados do mês atual apenas | Próximos 7 dias específicos |
| Sem feedback imediato | Feedback em < 2 minutos |
| Usuário confuso | UX consistente e reativa |

---

## Características Técnicas

### `useUpcomingEvents()` Hook

```tsx
const { 
  data: upcomingEvents = [],      // Eventos dos próximos 7 dias
  isLoading: loadingUpcoming,     // Estado de loading
  error: upcomingError,           // Estado de erro
  refetch: refetchUpcoming        // Função para refetch manual
} = useUpcomingEvents()
```

### Query Configuration

| Parâmetro | Valor | Propósito |
|-----------|-------|-----------|
| `queryKey` | `['upcoming-events', date]` | Cache key única |
| `staleTime` | `2 minutos` | Dados frescos |
| `refetchInterval` | `5 minutos` | Atualização periódica |
| `startDate` | `today` | Início: hoje |
| `endDate` | `today + 7 dias` | Fim: próxima semana |

---

## Como Funciona a Reatividade

### 1. Reatividade por Invalidação

Quando uma transação é criada:

```tsx
// ExpenseForm.tsx
const createExpense = useCreateExpense()

await createExpense.mutateAsync(data)
// → onSuccess: invalidateTransactionRelatedQueries()
// → Query ['calendar-events'] é marcada como stale
// → React Query faz refetch automático
// → UI atualiza
```

### 2. Reatividade por Subscription

O subscriber no `useCalendar.ts` escuta **todas** as mudanças:

```tsx
queryClient.getQueryCache().subscribe((event) => {
  // Qualquer mudança em ['transactions'] dispara invalidação
  if (event.query.queryKey[0] === 'transactions') {
    queryClient.invalidateQueries({ queryKey: ['calendar-events'] })
  }
})
```

### 3. Reatividade por Polling

O `refetchInterval` garante atualização periódica:

```tsx
useQuery({
  refetchInterval: 1000 * 60 * 5, // 5 minutos
  // ...
})
```

---

## Testes Recomendados

1. **Criar despesa com vencimento em 2 dias**
   - ✅ Deve aparecer imediatamente no CalendarWidget
   - ✅ Status "pendente"
   - ✅ Badge amarelo se ≤ 3 dias

2. **Criar receita para hoje**
   - ✅ Deve aparecer como "+ R$ XXX"
   - ✅ Indicador "Hoje"

3. **Pagar despesa**
   - ✅ Deve mudar status para "pago"
   - ✅ Badge verde
   - ✅ Botão "Pagar" desaparece

4. **Aguardar 5 minutos sem interação**
   - ✅ Dados atualizam automaticamente (polling)

5. **Criar despesa em outra aba**
   - ✅ Ao voltar, dados estão atualizados

---

## Padrão para Outros Componentes

Este padrão pode ser replicado para outros componentes que precisam de reatividade:

```tsx
// 1. Criar hook dedicado com query específica
function useSpecificData() {
  return useQuery({
    queryKey: ['specific-data'],
    queryFn: fetchSpecificData,
    staleTime: 1000 * 60 * 2,      // 2 minutos
    refetchInterval: 1000 * 60 * 5, // 5 minutos
  })
}

// 2. Usar no componente
function MyComponent() {
  const { data, isLoading, error } = useSpecificData()
  
  // Componente re-renderiza automaticamente quando dados mudam
}
```

---

## Arquivos Modificados

1. **`src/components/molecules/CalendarWidget.tsx`**
   - Adicionado hook `useUpcomingEvents()`
   - Removida dependência de `getUpcomingEvents()` derivado do mês
   - Atualizados estados de loading/error

2. **`src/hooks/useCalendar.ts`**
   - Adicionado subscriber para mudanças em `['transactions']`
   - Invalidação automática de `['calendar-events']`

---

## Conclusão

A seção "Próximos vencimentos" agora é **totalmente reativa**:
- ✅ Atualiza quando novas transações são criadas
- ✅ Atualiza quando transações são pagas
- ✅ Atualiza periodicamente (polling)
- ✅ Feedback imediato ao usuário
- ✅ Consistente com princípios de UI reativa
