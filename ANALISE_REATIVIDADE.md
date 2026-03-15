# Análise de Problemas de Reatividade e Proposta de Solução

## Problemas Identificados

### 1. **Estado Local Duplicado para Valores Monetários**

**Problema:** Os formulários `ExpenseForm.tsx` e `IncomeForm.tsx` mantêm estado local separado para o valor (`amountInput` e `amount` do react-hook-form), causando dessincronização.

```tsx
// Estado duplicado
const [amountInput, setAmountInput] = useState('');
const amount = watch('amount') || 0; // Outro estado separado
```

**Sintoma:** Ao alterar valores, a UI não reflete imediatamente as mudanças em outros componentes que usam o mesmo dado.

---

### 2. **Falta de Invalidação de Cache em Cascata**

**Problema:** Embora o `useCacheInvalidation.ts` seja bem estruturado, alguns hooks não o utilizam consistentemente.

**Exemplo:** `DailyLimitForm.tsx` usa estado local `selectedAccountId` que poderia ser derivado ou sincronizado com a conta default.

---

### 3. **Uso Inconsistente de `refetch` Após Mutations**

**Problema:** Apenas `IncomeForm.tsx` chama explicitamente `refetchAccounts()` após criar uma receita:

```tsx
// IncomeForm.tsx - Faz o refetch
await refetchAccounts();

// ExpenseForm.tsx - NÃO faz o refetch
// Apenas depende da invalidação do cache
```

**Sintoma:** O saldo só atualiza após recarregar a página em alguns casos.

---

### 4. **Componentes Derivados Não Reagem a Mudanças**

**Problema:** O `Extrato.tsx` e `CalendarWidget.tsx` calculam totais locais baseados em `useAccounts()`, mas não há garantia de que estão usando os dados mais recentes imediatamente após uma mutation.

```tsx
// Extrato.tsx - Cálculo local que pode estar desatualizado
const totals = accounts?.reduce(...)
```

---

### 5. **Múltiplas Fontes de Verdade para Contas**

**Problema:** O padrão de invalidação no `useCacheInvalidation.ts` tenta cobrir tanto queries do SDK (`getApiV1Accounts`) quanto queries manuais (`['accounts']`), o que pode causar inconsistência.

---

## Padrão Proposto para Resolver

### 1. **Unificar Estado de Valores Monetários**

**Solução:** Usar apenas o estado do `react-hook-form` e formatar diretamente no render.

```tsx
// ❌ ANTES - Estado duplicado
const [amountInput, setAmountInput] = useState('');
const amount = watch('amount') || 0;

// ✅ DEPOIS - Único estado
const amount = watch('amount') || 0;
const formattedAmount = formatCurrency(amount);

// Input controlado apenas para edição
<Input
  value={formattedAmount}
  onChange={(e) => {
    const numericValue = parseCurrency(e.target.value);
    setValue('amount', numericValue, { shouldValidate: true });
  }}
/>
```

---

### 2. **Criar Hook Composto para Transações + Accounts**

**Solução:** Criar um hook que agrupa todas as queries relacionadas e as invalida em conjunto.

```tsx
// hooks/useFinancialData.ts
import { useQueryClient } from '@tanstack/react-query';

export function useFinancialData() {
  const queryClient = useQueryClient();
  
  const accountsQuery = useGetApiV1Accounts();
  const transactionsQuery = useTransactions({ limit: 10 });
  
  const refreshAll = async () => {
    // Invalida e faz refetch em paralelo
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ 
        queryKey: [useGetApiV1Accounts.getKey()] 
      }),
    ]);
  };
  
  return {
    accounts: accountsQuery.data,
    transactions: transactionsQuery.data,
    isLoading: accountsQuery.isLoading || transactionsQuery.isLoading,
    refreshAll,
  };
}
```

---

### 3. **Padronizar Mutations com Callback de Sucesso**

**Solução:** Sempre passar `onSuccess` nas mutations e usar invalidação centralizada.

```tsx
// ✅ Padrão recomendado
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      // Invalida todas as queries relacionadas
      await queryClient.invalidateQueries({
        queryKey: [useGetApiV1Accounts.getKey()],
      });
      await queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
      
      // Opcional: mostrar toast
      toast.success('Transação criada!');
    },
  });
}
```

---

### 4. **Usar `useOptimisticUpdate` para Feedback Imediato**

**Solução:** Para melhor UX, atualizar a UI otimisticamente antes da confirmação do servidor.

```tsx
export function useCreateIncomeOptimistic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createIncome,
    onMutate: async (newIncome) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      // Snapshot do estado anterior
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      // Atualização otimista
      queryClient.setQueryData(['accounts'], (old: any) => ({
        ...old,
        available_balance: old.available_balance + newIncome.amount,
      }));
      
      return { previousAccounts };
    },
    onError: (err, variables, context) => {
      // Reverter em caso de erro
      queryClient.setQueryData(['accounts'], context.previousAccounts);
    },
    onSettled: () => {
      // Sempre invalidar para garantir consistência
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
```

---

### 5. **Criar Contexto de Sincronização de Dados**

**Solução:** Para componentes que precisam de dados sempre atualizados.

```tsx
// contexts/DataSyncContext.tsx
interface DataSyncContextType {
  lastSyncTime: number;
  triggerSync: () => void;
  subscribe: (callback: () => void) => () => void;
}

const DataSyncContext = createContext<DataSyncContextType | null>(null);

export function DataSyncProvider({ children }) {
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const callbacks = useRef(new Set<() => void>());
  
  const triggerSync = useCallback(() => {
    setLastSyncTime(Date.now());
    callbacks.current.forEach(cb => cb());
  }, []);
  
  const subscribe = useCallback((callback: () => void) => {
    callbacks.current.add(callback);
    return () => callbacks.current.delete(callback);
  }, []);
  
  return (
    <DataSyncContext.Provider value={{ lastSyncTime, triggerSync, subscribe }}>
      {children}
    </DataSyncContext.Provider>
  );
}

// Uso em componentes
function ExpenseForm() {
  const { triggerSync } = useContext(DataSyncContext);
  const createExpense = useCreateExpense();
  
  const handleSubmit = async (data) => {
    await createExpense.mutateAsync(data);
    triggerSync(); // Notifica todos os componentes inscritos
  };
}
```

---

### 6. **Refatorar `useCacheInvalidation` para Usar Keys do SDK**

**Solução:** Usar as keys padronizadas do SDK em vez de strings mágicas.

```tsx
// ✅ Padrão recomendado
import { useGetApiV1Accounts, useGetApiV1Transactions } from '@igorguariroba/bfin-sdk/react-query';

export function useCacheInvalidation() {
  const queryClient = useQueryClient();
  
  const invalidateTransactionRelatedQueries = () => {
    return Promise.all([
      queryClient.invalidateQueries({ 
        queryKey: useGetApiV1Transactions.getKey() 
      }),
      queryClient.invalidateQueries({ 
        queryKey: useGetApiV1Accounts.getKey() 
      }),
    ]);
  };
  
  // ...
}
```

---

## Checklist de Implementação

### Prioridade Alta (Crítico)

- [ ] Unificar estado de `amountInput` nos formulários
- [ ] Adicionar `refetchAccounts()` ou invalidação no `ExpenseForm.tsx`
- [ ] Padronizar todas as mutations para usar invalidação consistente
- [ ] Verificar se `Extrato.tsx` está reagindo a mudanças de accounts

### Prioridade Média (Melhoria de UX)

- [ ] Implementar atualizações otimistas (`onMutate`)
- [ ] Criar hook `useFinancialData` composto
- [ ] Adicionar loading states mais granulares

### Prioridade Baixa (Opcional)

- [ ] Implementar `DataSyncContext` para sincronização global
- [ ] Adicionar polling automático para dados críticos
- [ ] Implementar retry com backoff exponencial

---

## Exemplo de Refatoração Completa

### `ExpenseForm.tsx` - Versão Refatorada

```tsx
// Trechos principais da refatoração
export function ExpenseForm({ onSuccess, onCancel, defaultType = 'variable' }) {
  const { data: accounts } = useAccounts();
  const createExpense = useCreateExpense();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      type: defaultType,
    },
  });

  const amount = watch('amount');
  
  // ✅ Único estado para valor, formatado no render
  const formattedAmount = formatCurrency(amount);
  
  const onSubmit = async (data) => {
    try {
      await createExpense.mutateAsync({
        ...data,
        amount: Number(data.amount),
      });
      
      toast.success('Despesa criada!');
      onSuccess?.();
    } catch (error) {
      toast.error('Erro ao criar despesa');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ✅ Valor formatado diretamente do estado do form */}
      <Text
        cursor="pointer"
        onClick={() => setIsEditingAmount(true)}
      >
        {formattedAmount}
      </Text>
      
      {isEditingAmount && (
        <Input
          value={formatMoneyInput(amount)}
          onChange={(e) => {
            const value = parseCurrency(e.target.value);
            setValue('amount', value, { shouldValidate: true });
          }}
          onBlur={() => setIsEditingAmount(false)}
        />
      )}
    </form>
  );
}
```

---

## Conclusão

Os principais problemas de reatividade são causados por:

1. **Estado duplicado** para valores monetários
2. **Invalidação inconsistente** de cache após mutations
3. **Falta de sincronização** entre componentes que compartilham dados

A solução proposta segue o padrão do React Query de **single source of truth**, onde:
- O servidor é a fonte da verdade
- O cache do React Query é a cache primária
- Estado local é usado apenas para UI (editing, loading states)
- Mutations sempre invalidam queries relacionadas
