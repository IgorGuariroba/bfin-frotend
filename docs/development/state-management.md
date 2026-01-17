# 🔄 Gerenciamento de Estado

O projeto utiliza o **React Query** (TanStack Query) como principal ferramenta de gerenciamento de estado.

## Por que React Query?
Utilizamos para gerenciar o estado do servidor (Server State), lidando com cache, sincronização, estados de loading e erro de forma automática.

## Hooks Customizados
Toda a lógica de dados deve ser encapsulada em hooks customizados localizados em `src/hooks/`.

### Exemplos Principais:
- `useTransactions`: Busca, cria e remove transações.
- `useAccounts`: Gerencia a conta ativa e lista de contas do usuário.
- `useDailyLimit`: Gerencia o limite de gastos diários.
- `useCategories`: Busca a lista de categorias disponíveis.

## Invalidação de Cache
Ao realizar mutações (POST, PATCH, DELETE), sempre invalide as queries relacionadas para manter a interface atualizada:

```tsx
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: createTransaction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
  }
})
```
