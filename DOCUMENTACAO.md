# 📚 Documentação BFIN Frontend

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Padrões de Desenvolvimento](#-padrões-de-desenvolvimento)
- [Componentes](#-componentes)
- [Rotas e Páginas](#-rotas-e-páginas)
- [Estado e Gerenciamento de Dados](#-estado-e-gerenciamento-de-dados)
- [Autenticação](#-autenticação)
- [API e Services](#-api-e-services)
- [Testes](#-testes)
- [Storybook](#-storybook)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

**BFIN Frontend** é uma aplicação web de gerenciamento financeiro pessoal, permitindo que usuários:

- 📊 Visualizem dashboard com visão geral das finanças
- 💰 Gerenciem receitas e despesas (fixas e variáveis)
- 📉 Acompanhem transações e categorias
- 🎯 Definam e monitorem limites diários de gastos
- 👥 Gerenciem membros de contas compartilhadas

### Características Principais

- ✅ Interface moderna e responsiva com Chakra UI v3
- ✅ Autenticação JWT com refresh token automático
- ✅ Integração com backend via SDK privado
- ✅ Gerenciamento de estado com React Query
- ✅ Componentização seguindo Atomic Design
- ✅ Testes automatizados com Vitest + Playwright
- ✅ Documentação de componentes com Storybook

---

## 🛠 Tecnologias

### Core

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18.2.0 | Biblioteca UI principal |
| **TypeScript** | 5.3.3 | Tipagem estática |
| **Vite** | 7.3.1 | Build tool e dev server |
| **React Router DOM** | 6.30.3 | Roteamento SPA |

### UI & Estilização

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Chakra UI** | 3.30.0 | Sistema de design |
| **Lucide React** | 0.309.0 | Ícones |
| **React Icons** | 5.5.0 | Biblioteca de ícones adicional |
| **Recharts** | 3.0.0 | Gráficos e visualizações |
| **next-themes** | 0.4.6 | Gerenciamento de tema claro/escuro |

### Gerenciamento de Estado & Data Fetching

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **@tanstack/react-query** | 5.17.9 | Server state management |
| **Axios** | 1.6.5 | Cliente HTTP |
| **@igorguariroba/bfin-sdk** | 0.3.0 | SDK privado para API |

### Formulários & Validação

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React Hook Form** | 7.49.3 | Gerenciamento de formulários |
| **Zod** | 3.22.4 | Schema validation |
| **@hookform/resolvers** | 3.3.4 | Integração RHF + Zod |

### Testes

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Vitest** | 4.0.16 | Test runner |
| **Playwright** | 1.57.0 | E2E testing |
| **@storybook/addon-vitest** | 10.1.11 | Testes de componentes |

### Desenvolvimento

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Storybook** | 10.1.11 | Documentação de componentes |
| **ESLint** | 8.56.0 | Linter |
| **Concurrently** | 9.2.1 | Execução paralela de scripts |

---

## 🏗 Arquitetura

O projeto segue uma arquitetura baseada em:

### 1. **Atomic Design**
Componentes organizados em níveis de complexidade:
- **Atoms**: Componentes básicos (Button, Input)
- **Molecules**: Combinações simples (FormField, BalanceCard)
- **Organisms**: Componentes complexos (forms, charts, lists)

### 2. **Feature-based Structure**
Cada feature tem seus próprios:
- Páginas (`/pages`)
- Hooks customizados (`/hooks`)
- Services (`/services`)
- Contexts (`/contexts`)

### 3. **Separation of Concerns**
- **Presentation Layer**: Componentes UI
- **Business Logic**: Hooks e services
- **Data Layer**: React Query + SDK
- **Routing**: React Router com proteção de rotas

---

## 📁 Estrutura de Pastas

```
frontend/
├── public/                      # Assets estáticos
├── src/
│   ├── components/              # Componentes UI
│   │   ├── atoms/              # Componentes básicos
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── molecules/          # Componentes compostos
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── InfoBox.tsx
│   │   │   ├── RoleDisplay.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── index.ts
│   │   ├── organisms/          # Componentes complexos
│   │   │   ├── charts/         # Gráficos
│   │   │   ├── dialogs/        # Modais/Dialogs
│   │   │   ├── forms/          # Formulários
│   │   │   └── lists/          # Listas
│   │   ├── ui/                 # Componentes Chakra UI customizados
│   │   ├── utils/              # Componentes utilitários
│   │   ├── ColorModeSync.tsx   # Sincronização de tema
│   │   └── index.ts
│   ├── contexts/                # Contexts React
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── hooks/                   # Custom hooks
│   │   ├── useAccountMembers.ts
│   │   ├── useAccounts.ts
│   │   ├── useCategories.ts
│   │   ├── useColorMode.ts
│   │   ├── useDailyLimit.ts
│   │   └── useTransactions.ts
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   ├── Login.tsx           # Login
│   │   ├── Register.tsx        # Cadastro
│   │   ├── DailyLimitPage.tsx  # Gerenciar limite diário
│   │   ├── AllTransactionsPage.tsx  # Listar transações
│   │   ├── AddIncomePage.tsx   # Adicionar receita
│   │   ├── AddFixedExpensePage.tsx  # Adicionar despesa fixa
│   │   └── AddVariableExpensePage.tsx  # Adicionar despesa variável
│   ├── services/                # Camada de serviços
│   │   ├── api.ts              # Configuração Axios
│   │   ├── accountMemberService.ts
│   │   └── transactionService.ts
│   ├── config/                  # Configurações
│   │   └── sdk.ts              # Configuração do SDK
│   ├── theme/                   # Tema Chakra UI
│   ├── types/                   # TypeScript types
│   ├── stories/                 # Storybook stories
│   ├── App.tsx                  # Componente principal
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais
├── scripts/                     # Scripts auxiliares
│   └── setup-npmrc.js          # Setup de autenticação NPM
├── .storybook/                  # Configuração Storybook
├── dist/                        # Build de produção
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configuração TypeScript
├── vite.config.ts               # Configuração Vite
├── INSTALL.md                   # Guia de instalação
└── README.md                    # README básico
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js**: 18.x ou superior
- **npm**: 9.x ou superior
- **GitHub Personal Access Token** com permissão `read:packages`

### Configuração do Token NPM

O projeto usa o SDK privado `@igorguariroba/bfin-sdk` hospedado no GitHub Packages.

#### 1. Criar o Token

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Marque a permissão: **`read:packages`**
4. Copie o token gerado

#### 2. Configurar Ambiente Local

Crie um arquivo `.env` na raiz do projeto:

```bash
NPM_TOKEN=seu_token_github_aqui
VITE_API_BASE_URL=https://bfin-backend.onrender.com
```

#### 3. Instalar Dependências

```bash
npm run install:all
```

Ou manualmente:

```bash
node scripts/setup-npmrc.js
npm install
```

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NPM_TOKEN` | Token GitHub para instalar SDK privado | `ghp_xxxxx` |
| `VITE_API_BASE_URL` | URL base da API backend | `https://bfin-backend.onrender.com` |

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** |
| `dev` | `npm run dev` | Inicia Vite dev server + Storybook |
| `dev:vite` | `npm run dev:vite` | Inicia apenas Vite dev server (porta 5173) |
| `dev:storybook` | `npm run dev:storybook` | Inicia apenas Storybook (porta 6006) |
| **Build** |
| `build` | `npm run build` | Build de produção |
| `build:check` | `npm run build:check` | TypeScript check + build |
| `preview` | `npm run preview` | Preview do build de produção |
| **Instalação** |
| `setup:npmrc` | `npm run setup:npmrc` | Configura `.npmrc` com token NPM |
| `install:all` | `npm run install:all` | Setup completo + instalação |
| **Qualidade** |
| `lint` | `npm run lint` | Executa ESLint |
| **Storybook** |
| `storybook` | `npm run storybook` | Inicia Storybook (porta 6006) |
| `build-storybook` | `npm run build-storybook` | Build do Storybook |

### Exemplos de Uso

```bash
# Desenvolvimento (Vite + Storybook)
npm run dev

# Apenas aplicação
npm run dev:vite

# Apenas Storybook
npm run storybook

# Build de produção
npm run build

# Preview local do build
npm run preview
```

---

## 💻 Padrões de Desenvolvimento

### 1. Componentização

#### Atomic Design

```tsx
// Atom - Componente básico
// src/components/atoms/Button.tsx
import { Button as ChakraButton } from '@chakra-ui/react'

export const Button = ({ children, ...props }) => {
  return <ChakraButton {...props}>{children}</ChakraButton>
}

// Molecule - Composição simples
// src/components/molecules/FormField.tsx
import { Field } from '@chakra-ui/react'
import { Input } from '../atoms/Input'

export const FormField = ({ label, error, ...props }) => {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <Input {...props} />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  )
}

// Organism - Componente complexo
// src/components/organisms/forms/LoginForm.tsx
import { VStack } from '@chakra-ui/react'
import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'

export const LoginForm = ({ onSubmit }) => {
  return (
    <VStack as="form" onSubmit={onSubmit}>
      <FormField label="Email" type="email" />
      <FormField label="Senha" type="password" />
      <Button type="submit">Entrar</Button>
    </VStack>
  )
}
```

### 2. TypeScript

#### Tipos e Interfaces

```tsx
// Sempre definir tipos para props
interface ButtonProps {
  children: React.ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  loading?: boolean
  onClick?: () => void
}

export const Button = ({ children, variant = 'solid', loading, onClick }: ButtonProps) => {
  // ...
}

// Usar tipos do SDK quando disponível
import { User, Transaction } from '@igorguariroba/bfin-sdk'

interface DashboardProps {
  user: User
  transactions: Transaction[]
}
```

### 3. Hooks Customizados

#### Padrão de Hooks

```tsx
// src/hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTransactions, createTransaction } from '../services/transactionService'

export const useTransactions = () => {
  const queryClient = useQueryClient()

  // Query para listar
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  })

  // Mutation para criar
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidar cache para recarregar
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

### 4. Formulários

#### React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    // Processar login
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field.Root invalid={!!errors.email}>
        <Field.Label>Email</Field.Label>
        <Input {...register('email')} />
        {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
      </Field.Root>
      {/* ... */}
    </form>
  )
}
```

### 5. Chakra UI v3

#### Novos Padrões

```tsx
// ✅ Chakra UI v3 - Componentes compostos
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Backdrop />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Título</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>Conteúdo</Dialog.Body>
    <Dialog.Footer>
      <Button onClick={onClose}>Fechar</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

// ✅ Props renomeadas
<Button disabled loading colorPalette="orange">
  Salvar
</Button>

// ✅ Ícones como children
<Button>
  <Mail /> Enviar Email <ChevronRight />
</Button>

// ✅ Toaster
import { toaster } from './components/ui/toaster'

toaster.create({
  title: 'Sucesso!',
  type: 'success',
  placement: 'top-end',
})
```

---

## 🧩 Componentes

### Atoms (Componentes Básicos)

#### Button
```tsx
import { Button } from '@/components/atoms/Button'

<Button colorPalette="orange" loading>
  Salvar
</Button>
```

#### Input
```tsx
import { Input } from '@/components/atoms/Input'

<Input placeholder="Digite aqui..." />
```

### Molecules (Componentes Compostos)

#### BalanceCard
Exibe card com informação de saldo.

```tsx
import { BalanceCard } from '@/components/molecules/BalanceCard'

<BalanceCard
  title="Saldo Total"
  value={5000.00}
  variant="success"
/>
```

#### FormField
Campo de formulário com label e erro.

```tsx
import { FormField } from '@/components/molecules/FormField'

<FormField
  label="Email"
  error={errors.email?.message}
  {...register('email')}
/>
```

#### FormSelect
Select customizado para formulários.

```tsx
import { FormSelect } from '@/components/molecules/FormSelect'

<FormSelect
  label="Categoria"
  options={categories}
  {...register('category_id')}
/>
```

#### StatusBadge
Badge para exibir status.

```tsx
import { StatusBadge } from '@/components/molecules/StatusBadge'

<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="inactive" />
```

#### RoleDisplay
Exibe role do usuário com estilo.

```tsx
import { RoleDisplay } from '@/components/molecules/RoleDisplay'

<RoleDisplay role="owner" />
<RoleDisplay role="member" />
```

### Organisms (Componentes Complexos)

#### Charts
- Gráficos de receitas/despesas
- Visualizações de dados financeiros

#### Dialogs
- Modais de confirmação
- Dialogs de ações

#### Forms
- Formulários completos de receita/despesa
- Formulários de configuração

#### Lists
- Listas de transações
- Listas de membros

---

## 🗺 Rotas e Páginas

### Estrutura de Rotas

```tsx
// src/App.tsx
<Routes>
  {/* Rota raiz */}
  <Route path="/" element={<Navigate to="/dashboard" />} />

  {/* Rotas públicas */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

  {/* Rotas privadas */}
  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  <Route path="/daily-limit" element={<PrivateRoute><DailyLimitPage /></PrivateRoute>} />
  <Route path="/transactions" element={<PrivateRoute><AllTransactionsPage /></PrivateRoute>} />
  <Route path="/add-income" element={<PrivateRoute><AddIncomePage /></PrivateRoute>} />
  <Route path="/add-fixed-expense" element={<PrivateRoute><AddFixedExpensePage /></PrivateRoute>} />
  <Route path="/add-variable-expense" element={<PrivateRoute><AddVariableExpensePage /></PrivateRoute>} />

  {/* 404 */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

### Proteção de Rotas

#### PrivateRoute
Protege rotas que requerem autenticação.

```tsx
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingScreen />
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}
```

#### PublicRoute
Redireciona usuários autenticados para o dashboard.

```tsx
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingScreen />
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>
}
```

### Páginas

| Rota | Componente | Descrição | Proteção |
|------|------------|-----------|----------|
| `/` | Redirect | Redireciona para `/dashboard` | - |
| `/login` | `Login` | Página de login | Pública |
| `/register` | `Register` | Página de cadastro | Pública |
| `/dashboard` | `Dashboard` | Dashboard principal com visão geral | Privada |
| `/daily-limit` | `DailyLimitPage` | Gerenciar limite diário | Privada |
| `/transactions` | `AllTransactionsPage` | Listar todas as transações | Privada |
| `/add-income` | `AddIncomePage` | Adicionar receita | Privada |
| `/add-fixed-expense` | `AddFixedExpensePage` | Adicionar despesa fixa | Privada |
| `/add-variable-expense` | `AddVariableExpensePage` | Adicionar despesa variável | Privada |

---

## 🔄 Estado e Gerenciamento de Dados

### React Query

O projeto usa **@tanstack/react-query** para gerenciar estado do servidor.

#### Configuração

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
})

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

#### Hooks Customizados

##### useTransactions
```tsx
const {
  transactions,
  isLoading,
  error,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = useTransactions()
```

##### useAccounts
```tsx
const {
  accounts,
  currentAccount,
  isLoading,
  selectAccount,
  createAccount,
} = useAccounts()
```

##### useCategories
```tsx
const {
  categories,
  isLoading,
  getCategoryById,
} = useCategories()
```

##### useDailyLimit
```tsx
const {
  dailyLimit,
  isLoading,
  updateDailyLimit,
  remainingToday,
} = useDailyLimit()
```

##### useAccountMembers
```tsx
const {
  members,
  isLoading,
  inviteMember,
  removeMember,
  updateMemberRole,
} = useAccountMembers()
```

---

## 🔐 Autenticação

### AuthContext

O projeto usa Context API para gerenciar autenticação.

#### Estrutura

```tsx
interface AuthContextData {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, full_name: string) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}
```

#### Uso

```tsx
import { useAuth } from '@/contexts/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <div>
      {isAuthenticated && (
        <>
          <p>Olá, {user?.full_name}</p>
          <button onClick={signOut}>Sair</button>
        </>
      )}
    </div>
  )
}
```

### Fluxo de Autenticação

#### 1. Login
```tsx
const { signIn } = useAuth()

await signIn('user@example.com', 'senha123')
// ✅ Salva tokens no localStorage
// ✅ Atualiza token no SDK
// ✅ Redireciona para dashboard
```

#### 2. Cadastro
```tsx
const { signUp } = useAuth()

await signUp('user@example.com', 'senha123', 'João Silva')
// ✅ Cria conta
// ✅ Salva tokens no localStorage
// ✅ Redireciona para dashboard
```

#### 3. Logout
```tsx
const { signOut } = useAuth()

signOut()
// ✅ Remove tokens do localStorage
// ✅ Limpa estado do usuário
// ✅ Redireciona para login
```

### Refresh Token Automático

O interceptor do Axios detecta 401 e renova o token automaticamente.

```tsx
// src/services/api.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('@bfin:refreshToken')

      if (refreshToken) {
        try {
          // Renovar tokens
          const { data } = await axios.post('/auth/refresh', {
            refresh_token: refreshToken,
          })

          // Salvar novos tokens
          localStorage.setItem('@bfin:token', data.tokens.access_token)
          localStorage.setItem('@bfin:refreshToken', data.tokens.refresh_token)

          // Repetir requisição original
          return api.request(error.config)
        } catch {
          // Refresh falhou, fazer logout
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)
```

---

## 🌐 API e Services

### Configuração da API

```tsx
// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
    : '/api/v1', // Proxy Vite em dev
  headers: {
    'Content-Type': 'application/json',
  },
})

// Adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@bfin:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### BFIN SDK

O projeto usa o SDK privado `@igorguariroba/bfin-sdk` para comunicação com a API.

#### Configuração

```tsx
// src/config/sdk.ts
import { Configuration, setAuthToken } from '@igorguariroba/bfin-sdk'

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL,
})

export const updateSdkToken = (token: string) => {
  setAuthToken(token)
}

export default configuration
```

#### Uso

```tsx
import {
  getTransactions,
  getCategories,
  getAccounts
} from '@igorguariroba/bfin-sdk'

// Buscar transações
const transactions = await getTransactions().getApiV1Transactions()

// Buscar categorias
const categories = await getCategories().getApiV1Categories()

// Buscar contas
const accounts = await getAccounts().getApiV1Accounts()
```

### Services

#### transactionService.ts
```tsx
// src/services/transactionService.ts
import api from './api'

export const getTransactions = async () => {
  const { data } = await api.get('/transactions')
  return data
}

export const createTransaction = async (transaction: CreateTransactionDTO) => {
  const { data } = await api.post('/transactions', transaction)
  return data
}

export const updateTransaction = async (id: string, transaction: UpdateTransactionDTO) => {
  const { data } = await api.patch(`/transactions/${id}`, transaction)
  return data
}

export const deleteTransaction = async (id: string) => {
  await api.delete(`/transactions/${id}`)
}
```

#### accountMemberService.ts
```tsx
// src/services/accountMemberService.ts
import api from './api'

export const getAccountMembers = async (accountId: string) => {
  const { data } = await api.get(`/accounts/${accountId}/members`)
  return data
}

export const inviteMember = async (accountId: string, email: string) => {
  const { data } = await api.post(`/accounts/${accountId}/members`, { email })
  return data
}

export const removeMember = async (accountId: string, memberId: string) => {
  await api.delete(`/accounts/${accountId}/members/${memberId}`)
}
```

---

## 🧪 Testes

### Vitest + Playwright

O projeto usa **Vitest** como test runner e **Playwright** para testes de browser.

#### Configuração

```ts
// vite.config.ts
export default defineConfig({
  test: {
    projects: [{
      extends: true,
      plugins: [
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
})
```

#### Executar Testes

```bash
# Executar todos os testes
npm test

# Modo watch
npm test -- --watch

# Com coverage
npm test -- --coverage

# Testes específicos
npm test -- Button.test.tsx
```

#### Exemplo de Teste

```tsx
// src/components/atoms/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('deve renderizar corretamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('deve exibir loading spinner', () => {
    render(<Button loading>Salvar</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('deve chamar onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)

    await userEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
```

---

## 📖 Storybook

### Documentação de Componentes

O projeto usa **Storybook** para documentar e desenvolver componentes isoladamente.

#### Executar Storybook

```bash
npm run storybook
# Abre em http://localhost:6006
```

#### Estrutura de Stories

```tsx
// src/components/atoms/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    colorPalette: {
      control: 'select',
      options: ['orange', 'blue', 'green', 'red'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Button',
    colorPalette: 'orange',
  },
}

export const Loading: Story = {
  args: {
    children: 'Salvando...',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}
```

#### Addons Instalados

- **@storybook/addon-a11y**: Testes de acessibilidade
- **@storybook/addon-docs**: Documentação automática
- **@storybook/addon-vitest**: Integração com Vitest
- **@chromatic-com/storybook**: Visual testing

#### Build Storybook

```bash
npm run build-storybook
# Gera build estático em storybook-static/
```

---

## 🚀 Deploy

### Deploy no Render

O projeto está configurado para deploy automático no Render.

#### Configuração

1. **Variáveis de Ambiente**
   - `NPM_TOKEN`: Token GitHub com permissão `read:packages`
   - `VITE_API_BASE_URL`: URL do backend

2. **Build Command**
   ```bash
   node scripts/setup-npmrc.js && npm ci && npm run build
   ```

3. **Publish Directory**
   ```
   dist
   ```

#### Script de Setup NPM

```js
// scripts/setup-npmrc.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const npmrcPath = path.join(__dirname, '..', '.npmrc');
const token = process.env.NPM_TOKEN;

if (!token) {
  console.error('❌ NPM_TOKEN não encontrado no .env');
  process.exit(1);
}

const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${token}`;

fs.writeFileSync(npmrcPath, npmrcContent);
console.log('✅ .npmrc configurado com sucesso!');
```

### Deploy Manual

```bash
# 1. Build
npm run build

# 2. Preview local
npm run preview

# 3. Deploy (exemplo: Vercel)
vercel --prod

# Ou Netlify
netlify deploy --prod --dir=dist
```

### Otimizações de Build

```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'chakra': ['@chakra-ui/react'],
          'charts': ['recharts'],
        },
      },
    },
  },
})
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### ❌ Erro 401 Unauthorized (NPM)

**Causa**: Token NPM inválido ou sem permissão

**Solução**:
1. Verifique se o token tem permissão `read:packages`
2. Gere um novo token: https://github.com/settings/tokens
3. Atualize no `.env` (local) ou Render (produção)
4. Execute: `npm run setup:npmrc && npm install`

#### ❌ Erro 404 Not Found (NPM)

**Causa**: `.npmrc` não foi configurado

**Solução**:
```bash
npm run setup:npmrc
npm install
```

#### ❌ Token não encontrado

**Causa**: Arquivo `.env` não existe ou está vazio

**Solução**:
1. Crie o arquivo `.env` na raiz do projeto
2. Adicione: `NPM_TOKEN=seu_token_aqui`
3. Execute: `npm run setup:npmrc`

#### ❌ Erro de autenticação na aplicação

**Causa**: Token expirado ou backend offline

**Solução**:
1. Verifique se o backend está rodando
2. Limpe localStorage: `localStorage.clear()`
3. Faça login novamente
4. Verifique variável `VITE_API_BASE_URL`

#### ❌ Storybook não inicia

**Causa**: Porta 6006 ocupada

**Solução**:
```bash
# Matar processo na porta 6006
lsof -ti:6006 | xargs kill -9

# Ou iniciar em outra porta
npx storybook dev -p 6007
```

#### ❌ Build falha no TypeScript

**Causa**: Erros de tipagem

**Solução**:
```bash
# Verificar erros
npm run build:check

# Ver erros detalhados
npx tsc --noEmit
```

#### ❌ Componentes Chakra não aparecem

**Causa**: Tema não configurado ou Provider ausente

**Solução**:
```tsx
// Verificar se App tem Provider
import { Provider } from './components/ui/provider'

<Provider>
  <App />
</Provider>
```

### Debug

#### Verificar variáveis de ambiente

```tsx
console.log('API URL:', import.meta.env.VITE_API_BASE_URL)
console.log('Mode:', import.meta.env.MODE)
console.log('Dev:', import.meta.env.DEV)
```

#### Verificar token

```tsx
console.log('Token:', localStorage.getItem('@bfin:token'))
console.log('User:', localStorage.getItem('@bfin:user'))
```

#### React Query DevTools

```tsx
// Adicionar em desenvolvimento
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## 📝 Changelog e Roadmap

### Versão Atual: 1.0.0

#### Funcionalidades
- ✅ Autenticação com JWT + Refresh Token
- ✅ Dashboard com visão geral financeira
- ✅ Gerenciamento de receitas e despesas
- ✅ Categorização de transações
- ✅ Limite diário de gastos
- ✅ Contas compartilhadas com membros
- ✅ Tema claro/escuro
- ✅ Responsivo

#### Tecnologias
- ✅ React 18 + TypeScript
- ✅ Chakra UI v3
- ✅ React Query
- ✅ React Router v6
- ✅ React Hook Form + Zod
- ✅ Storybook
- ✅ Vitest + Playwright

### Roadmap

#### v1.1.0
- [ ] Relatórios e exportação de dados
- [ ] Filtros avançados de transações
- [ ] Gráficos mais detalhados
- [ ] Notificações push

#### v1.2.0
- [ ] Múltiplas contas
- [ ] Categorias customizadas
- [ ] Metas financeiras
- [ ] Integração com bancos (Open Banking)

#### v2.0.0
- [ ] App mobile (React Native)
- [ ] Modo offline
- [ ] Sincronização multi-dispositivo
- [ ] IA para análise financeira

---

## 👥 Contribuindo

### Setup para Desenvolvimento

```bash
# 1. Clone o repositório
git clone https://github.com/igorguariroba/bfin-frontend.git
cd bfin-frontend

# 2. Configure o .env
cp .env.example .env
# Edite .env com suas credenciais

# 3. Instale dependências
npm run install:all

# 4. Execute desenvolvimento
npm run dev

# 5. Execute Storybook (opcional)
npm run storybook
```

### Workflow

1. Crie uma branch para sua feature
   ```bash
   git checkout -b feature/minha-feature
   ```

2. Faça suas alterações seguindo os padrões

3. Execute linter e testes
   ```bash
   npm run lint
   npm test
   ```

4. Commit com mensagem descritiva
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```

5. Push e abra Pull Request
   ```bash
   git push origin feature/minha-feature
   ```

### Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação (não afeta código)
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Tarefas de manutenção

---

## 📞 Suporte

### Documentação Adicional

- [INSTALL.md](./INSTALL.md) - Guia de instalação detalhado
- [Storybook](http://localhost:6006) - Documentação de componentes
- [Chakra UI v3](https://v3.chakra-ui.com/) - Sistema de design

### Recursos Úteis

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Contato

- **GitHub**: [@igorguariroba](https://github.com/igorguariroba)
- **Email**: igorguariroba@example.com

---

## 📄 Licença

Este projeto é privado e proprietário.

© 2026 BFIN - Todos os direitos reservados.

---

**Última atualização**: Janeiro 2026
**Versão do documento**: 1.0.0
