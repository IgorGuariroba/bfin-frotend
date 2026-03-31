# BFIN SDK - Guia Completo

## 🔧 Setup Inicial

### 1. Configuração NPM Token

```bash
# 1. Criar token GitHub: https://github.com/settings/tokens
# Permissions: read:packages

# 2. Adicionar no .env
NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 3. Setup automático
npm run setup:npmrc
npm install
```

### 2. Estrutura .npmrc
```bash
# Arquivo .npmrc (criado automaticamente)
@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

---

## 📦 Importações e Uso

### Importações Básicas
```tsx
// Serviços principais
import {
  getTransactions,
  getCategories,
  getAccounts,
  getIncomes,
  getExpenses,
  getDailyLimits
} from '@igorguariroba/bfin-sdk'

// Tipos TypeScript
import type {
  User,
  Transaction,
  Category,
  Account,
  Income,
  Expense,
  DailyLimit
} from '@igorguariroba/bfin-sdk'
```

### Configuração do Cliente
```tsx
// config/sdk.ts
import { configure } from '@igorguariroba/bfin-sdk'

configure({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})
```

---

## 🔄 Integração com React Query

### Hook de Transações
```tsx
export const useTransactions = () => {
  const queryClient = useQueryClient()

  // Query - Listar transações
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions().getApiV1Transactions()
      return response.data
    },
  })

  // Mutation - Criar transação
  const createMutation = useMutation({
    mutationFn: async (transaction: CreateTransactionData) => {
      const response = await getTransactions().postApiV1Transactions(transaction)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return {
    transactions: data ?? [],
    isLoading,
    error,
    createTransaction: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}
```

### Hook de Categorias
```tsx
export const useCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories().getApiV1Categories()
      return response.data
    },
  })

  return {
    categories: data ?? [],
    isLoading,
  }
}
```

---

## 🎯 Exemplos Práticos

### Listar Transações
```tsx
const TransactionsList = () => {
  const { transactions, isLoading } = useTransactions()

  if (isLoading) return <Spinner />

  return (
    <VStack>
      {transactions.map(transaction => (
        <Card key={transaction.id}>
          <Text>{transaction.description}</Text>
          <Text>R$ {transaction.amount}</Text>
        </Card>
      ))}
    </VStack>
  )
}
```

### Criar Transação
```tsx
const CreateTransactionForm = () => {
  const { createTransaction, isCreating } = useTransactions()

  const onSubmit = (data: FormData) => {
    createTransaction({
      description: data.description,
      amount: data.amount,
      categoryId: data.categoryId,
      date: new Date().toISOString(),
      type: 'expense'
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* campos do formulário */}
      <Button type="submit" loading={isCreating}>
        Criar Transação
      </Button>
    </form>
  )
}
```

### Filtrar por Categoria
```tsx
export const useTransactionsByCategory = (categoryId?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', 'category', categoryId],
    queryFn: async () => {
      const params = categoryId ? { categoryId } : {}
      const response = await getTransactions().getApiV1Transactions(params)
      return response.data
    },
    enabled: !!categoryId,
  })

  return {
    transactions: data ?? [],
    isLoading,
  }
}
```

---

## 📊 Estruturas de Dados

### Transaction
```tsx
interface Transaction {
  id: string
  description: string
  amount: number
  categoryId: string
  accountId: string
  userId: string
  date: string
  type: 'income' | 'expense'
  createdAt: string
  updatedAt: string
}
```

### Category
```tsx
interface Category {
  id: string
  name: string
  color: string
  icon?: string
  type: 'income' | 'expense'
  userId: string
}
```

### Account
```tsx
interface Account {
  id: string
  name: string
  balance: number
  currency: string
  userId: string
  members?: AccountMember[]
}
```

### Income/Expense
```tsx
interface Income {
  id: string
  description: string
  amount: number
  categoryId: string
  isFixed: boolean
  frequency?: 'monthly' | 'weekly' | 'yearly'
  dueDate?: string
}
```

---

## 🔐 Autenticação

### Login
```tsx
import { authenticate } from '@igorguariroba/bfin-sdk'

const login = async (email: string, password: string) => {
  try {
    const response = await authenticate().postApiV1AuthLogin({
      email,
      password
    })

    const { token, refreshToken, user } = response.data

    // Salvar no localStorage
    localStorage.setItem('@bfin:token', token)
    localStorage.setItem('@bfin:refreshToken', refreshToken)
    localStorage.setItem('@bfin:user', JSON.stringify(user))

    return { user, token }
  } catch (error) {
    throw new Error('Credenciais inválidas')
  }
}
```

### Logout
```tsx
const logout = () => {
  localStorage.removeItem('@bfin:token')
  localStorage.removeItem('@bfin:refreshToken')
  localStorage.removeItem('@bfin:user')
}
```

---

## ⚠️ Tratamento de Erros

```tsx
const { data, error, isLoading } = useQuery({
  queryKey: ['transactions'],
  queryFn: async () => {
    try {
      const response = await getTransactions().getApiV1Transactions()
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expirado - fazer logout
        logout()
        throw new Error('Sessão expirada')
      }

      if (error.response?.status === 403) {
        throw new Error('Acesso negado')
      }

      throw new Error('Erro ao carregar transações')
    }
  },
})

if (error) {
  toaster.create({
    title: error.message,
    type: 'error',
  })
}
```

---

## 🚨 Troubleshooting

### Erro 401 Unauthorized (NPM)
```bash
# Token NPM inválido
# 1. Gerar novo token: https://github.com/settings/tokens
# 2. Atualizar .env: NPM_TOKEN=novo_token
# 3. Executar:
npm run setup:npmrc
npm install
```

### Erro de CORS
```bash
# Verificar VITE_API_BASE_URL no .env
VITE_API_BASE_URL=https://api.bfin.com.br
```

### SDK não encontrado
```bash
# Verificar se o token tem permissão read:packages
# Verificar se o .npmrc está correto
cat .npmrc
```

### Tipos TypeScript não funcionam
```tsx
// Sempre importar tipos explicitamente
import type { Transaction } from '@igorguariroba/bfin-sdk'

// Não:
import { Transaction } from '@igorguariroba/bfin-sdk'
```

---

## 📝 Versionamento

```bash
# Versão atual
npm list @igorguariroba/bfin-sdk

# Atualizar
npm update @igorguariroba/bfin-sdk
```

**Versão atual do projeto**: `0.12.0`