# 🤖 Guia Claude - BFIN Frontend

Este documento serve como referência para o Claude AI ao trabalhar no projeto BFIN Frontend.

---

## 📋 Contexto do Projeto

**BFIN Frontend** é uma aplicação web React/TypeScript de gerenciamento financeiro pessoal. O projeto usa Chakra UI v3 para interface, React Query para gerenciamento de estado do servidor, e um SDK privado para comunicação com o backend.

### Objetivo Principal
Permitir que usuários gerenciem suas finanças pessoais através de:
- Dashboard com visão geral
- Gerenciamento de receitas e despesas (fixas e variáveis)
- Acompanhamento de transações e categorias
- Definição de limites diários de gastos
- Gerenciamento de membros em contas compartilhadas

---

## 🛠 Stack Tecnológico

### Core
- **React 18.2.0** - Biblioteca UI principal
- **TypeScript 5.3.3** - Tipagem estática
- **Vite 7.3.1** - Build tool e dev server
- **React Router DOM 6.30.3** - Roteamento SPA

### UI & Estilização
- **Chakra UI 3.30.0** - Sistema de design (⚠️ V3 - veja regras específicas)
- **Lucide React 0.309.0** - Ícones principais
- **React Icons 5.5.0** - Ícones complementares
- **Recharts 3.0.0** - Gráficos e visualizações
- **next-themes 0.4.6** - Gerenciamento de tema claro/escuro

### Gerenciamento de Estado
- **@tanstack/react-query 5.17.9** - Server state management
- **Axios 1.6.5** - Cliente HTTP
- **@igorguariroba/bfin-sdk 0.3.0** - SDK privado (GitHub Packages)

### Formulários & Validação
- **React Hook Form 7.49.3** - Gerenciamento de formulários
- **Zod 3.22.4** - Schema validation
- **@hookform/resolvers 3.3.4** - Integração RHF + Zod

### Testes & Documentação
- **Vitest 4.0.16** - Test runner
- **Playwright 1.57.0** - E2E testing
- **Storybook 10.1.11** - Documentação de componentes

### CI/CD
- **GitHub Actions** - Pipeline de CI/CD automatizado
- **Render** - Deploy automático de produção

---

## 📁 Estrutura de Diretórios

```
frontend/
├── src/
│   ├── components/           # Componentes UI (Atomic Design)
│   │   ├── atoms/           # Componentes básicos (Button, Input)
│   │   ├── molecules/       # Componentes compostos (BalanceCard, FormField)
│   │   ├── organisms/       # Componentes complexos
│   │   │   ├── charts/     # Gráficos
│   │   │   ├── dialogs/    # Modais/Dialogs
│   │   │   ├── forms/      # Formulários
│   │   │   └── lists/      # Listas
│   │   ├── ui/             # Componentes Chakra UI customizados
│   │   └── utils/          # Componentes utilitários
│   ├── contexts/            # React Contexts (AuthContext)
│   ├── hooks/               # Custom hooks (useTransactions, useAccounts)
│   ├── pages/               # Páginas da aplicação
│   ├── services/            # Camada de serviços (API)
│   ├── config/              # Configurações (SDK)
│   ├── theme/               # Tema Chakra UI
│   ├── types/               # TypeScript types
│   ├── stories/             # Storybook stories
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Entry point
├── scripts/                 # Scripts auxiliares
│   └── setup-npmrc.js      # Setup de autenticação NPM
├── .storybook/              # Configuração Storybook
├── package.json
├── tsconfig.json
├── vite.config.ts
├── DOCUMENTACAO.md          # Documentação completa (LEIA PRIMEIRO)
└── INSTALL.md               # Guia de instalação
```

---

## 🎯 Regras Críticas de Desenvolvimento

### 1. Chakra UI v3 (MUITO IMPORTANTE!)

O projeto usa **Chakra UI v3**, que tem mudanças **significativas** em relação à v2. Veja as regras no repositório (`.cursorrules`) ou consulte o arquivo de regras específicas.

#### Principais Mudanças:

**Componentes Compostos (Pattern Root/Content/Item):**
```tsx
// ❌ V2
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Título</ModalHeader>
  </ModalContent>
</Modal>

// ✅ V3
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Backdrop />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Título</Dialog.Title>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

**Props Renomeadas:**
- `isOpen` → `open`
- `isDisabled` → `disabled`
- `isInvalid` → `invalid`
- `isRequired` → `required`
- `isLoading` → `loading`
- `colorScheme` → `colorPalette`
- `spacing` → `gap`

**Ícones em Botões:**
```tsx
// ❌ V2
<Button leftIcon={<Mail />}>Email</Button>

// ✅ V3
<Button><Mail /> Email</Button>
```

**Toaster:**
```tsx
// ✅ V3
import { toaster } from "./components/ui/toaster"

toaster.create({
  title: "Sucesso!",
  type: "success", // não "status"
  placement: "top-end", // não "position"
})
```

**Table:**
```tsx
// ✅ V3
<Table.Root variant="line">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Header</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Cell</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### 2. Importações Corretas

**Do @chakra-ui/react:**
```tsx
import {
  Button, Input, Box, Flex, Stack, HStack, VStack,
  Text, Heading, Card, Field, Table, Avatar,
  Alert, NativeSelect, Tabs, Textarea, Separator
} from '@chakra-ui/react'
```

**De components/ui (relativos):**
```tsx
import { Provider } from './components/ui/provider'
import { Toaster, toaster } from './components/ui/toaster'
import { Tooltip } from './components/ui/tooltip'
import { PasswordInput } from './components/ui/password-input'
```

**Ícones:**
```tsx
import { Mail, ChevronRight } from 'lucide-react' // ✅ Preferencial
import { FaBeer } from 'react-icons/fa' // ✅ Alternativa
```

### 3. Atomic Design

Siga rigorosamente a hierarquia:

- **Atoms** (`components/atoms/`): Componentes básicos, sem lógica de negócio
- **Molecules** (`components/molecules/`): Combinações simples de átomos
- **Organisms** (`components/organisms/`): Componentes complexos com lógica

**Nunca importe um nível superior em um inferior** (ex: Organism dentro de Atom).

### 4. TypeScript

- **Sempre** defina tipos para props de componentes
- Use tipos do SDK quando disponíveis: `import type { User, Transaction } from '@igorguariroba/bfin-sdk'`
- Prefira `interface` para props de componentes
- Prefira `type` para unions e intersections

```tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
  loading?: boolean
  onClick?: () => void
}

export const Button = ({ children, variant = 'solid', loading, onClick }: ButtonProps) => {
  // ...
}
```

### 5. React Query

Use **@tanstack/react-query** para todas as chamadas de API:

```tsx
// Hook customizado
export const useTransactions = () => {
  const queryClient = useQueryClient()

  // Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  })

  // Mutation
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return {
    transactions: data ?? [],
    isLoading,
    error,
    createTransaction: createMutation.mutate,
  }
}
```

**Importante:**
- Sempre use `queryClient.invalidateQueries()` após mutations
- Use `queryKey` consistente em toda a aplicação
- Prefira hooks customizados a queries inline

### 6. Formulários

Use **React Hook Form + Zod** para todos os formulários:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    // ...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field.Root invalid={!!errors.email}>
        <Field.Label>Email</Field.Label>
        <Input {...register('email')} />
        {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
      </Field.Root>
    </form>
  )
}
```

### 7. Autenticação

O projeto usa **AuthContext** para gerenciar autenticação:

```tsx
import { useAuth } from '@/contexts/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuth()

  // ...
}
```

**Tokens armazenados em localStorage:**
- `@bfin:token` - Access token
- `@bfin:refreshToken` - Refresh token
- `@bfin:user` - Dados do usuário

**Refresh automático** configurado no interceptor Axios (`src/services/api.ts`).

### 8. Rotas

Use **React Router v6** com proteção de rotas:

```tsx
// Rota privada (requer autenticação)
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

// Rota pública (redireciona se autenticado)
<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
```

### 9. SDK Privado

O projeto usa `@igorguariroba/bfin-sdk` (hospedado no GitHub Packages).

**Configuração necessária:**
- Arquivo `.env` com `NPM_TOKEN` (GitHub token com `read:packages`)
- Executar `npm run setup:npmrc` antes de `npm install`

**Uso:**
```tsx
import { getTransactions, getCategories } from '@igorguariroba/bfin-sdk'

const transactions = await getTransactions().getApiV1Transactions()
const categories = await getCategories().getApiV1Categories()
```

---

## 🚀 Scripts Comuns

```bash
# Desenvolvimento (Vite + Storybook)
npm run dev

# Apenas aplicação
npm run dev:vite

# Apenas Storybook
npm run storybook

# Build de produção
npm run build

# TypeScript check + build
npm run build:check

# Linter
npm run lint

# Preview local do build
npm run preview

# Setup NPM (instalar SDK privado)
npm run setup:npmrc
npm run install:all

# Testes
npm test                  # Modo watch
npm test -- --run         # Executar uma vez
npm run test:ui           # Com interface visual
npm run test:coverage     # Com cobertura

# TypeScript
npm run type-check        # Verificar tipos sem build
```

---

## 🔄 CI/CD Pipeline

O projeto possui pipeline automatizado com GitHub Actions:

### Workflows

**CI Pipeline** (`.github/workflows/ci.yml`)
- Executa em push/PR para `main` e `develop`
- Jobs:
  1. **Code Quality**: TypeScript check, ESLint, npm audit
  2. **Tests**: Vitest + Playwright com cobertura
  3. **Build**: Validação de build de produção
  4. **Storybook**: Build do Storybook (só em main)
  5. **Summary**: Relatório final

**Deploy** (`.github/workflows/deploy.yml`)
- Executa em push para `main`
- Build + trigger de deploy no Render

### Secrets Necessários

Configure em: `Settings > Secrets > Actions`

- `NPM_TOKEN` - Token GitHub com `read:packages`
- `VITE_API_BASE_URL` - URL da API
- `RENDER_DEPLOY_HOOK_URL` - Webhook do Render (opcional)

Ver: `.github/SECRETS.md` para instruções detalhadas

### Validação Local (antes de push)

```bash
# Executar todas as validações do CI localmente
npm run type-check && \
npm run lint && \
npm test -- --run && \
npm run build
```

---

## 📝 Padrões de Nomenclatura

### Arquivos
- **Componentes**: PascalCase - `Button.tsx`, `FormField.tsx`
- **Hooks**: camelCase com prefixo `use` - `useTransactions.ts`
- **Services**: camelCase com sufixo `Service` - `transactionService.ts`
- **Types**: camelCase com sufixo `Types` - `transactionTypes.ts`
- **Contexts**: PascalCase com sufixo `Context` - `AuthContext.tsx`

### Componentes
```tsx
// Nome do componente = nome do arquivo
// Button.tsx
export const Button = () => { ... }

// FormField.tsx
export const FormField = () => { ... }
```

### Hooks
```tsx
// useTransactions.ts
export const useTransactions = () => { ... }

// Retornar objeto com nomes descritivos
return {
  transactions: data ?? [],
  isLoading,
  error,
  createTransaction: createMutation.mutate,
  isCreating: createMutation.isPending,
}
```

---

## 🎨 Padrões de Estilo

### Tema
O projeto usa tema customizado do Chakra UI v3:

```tsx
// Paleta principal: orange
<Button colorPalette="orange">Salvar</Button>

// Cores disponíveis
colorPalette="orange" | "blue" | "green" | "red" | "gray"
```

### Responsividade
Use breakpoints do Chakra:

```tsx
<Box
  width={{ base: "100%", md: "50%", lg: "33%" }}
  padding={{ base: 4, md: 6, lg: 8 }}
>
  Content
</Box>
```

### Tema Claro/Escuro
Use `useColorMode` hook:

```tsx
import { useColorMode } from '@/hooks/useColorMode'

const MyComponent = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button onClick={toggleColorMode}>
      {colorMode === 'light' ? 'Modo Escuro' : 'Modo Claro'}
    </Button>
  )
}
```

---

## 🧪 Testes

### Vitest + Playwright

```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('deve renderizar corretamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### Storybook

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Button',
    colorPalette: 'orange',
  },
}
```

---

## 🐛 Troubleshooting Comum

### Erro 401 Unauthorized (NPM)
**Causa**: Token NPM inválido ou sem permissão

**Solução**:
```bash
# 1. Gerar novo token: https://github.com/settings/tokens
# 2. Atualizar .env com NPM_TOKEN=seu_token
# 3. Executar:
npm run setup:npmrc
npm install
```

### Componentes Chakra não aparecem
**Causa**: Provider ausente ou configurado incorretamente

**Solução**: Verificar se `main.tsx` tem:
```tsx
import { Provider } from './components/ui/provider'

<Provider>
  <App />
</Provider>
```

### Erro de autenticação na aplicação
**Causa**: Token expirado ou backend offline

**Solução**:
```tsx
// Limpar localStorage
localStorage.clear()

// Fazer login novamente
// Verificar VITE_API_BASE_URL
```

---

## 📚 Referências Rápidas

### Documentação
- [DOCUMENTACAO.md](./DOCUMENTACAO.md) - Documentação completa (LEIA PRIMEIRO!)
- [CI-CD.md](./CI-CD.md) - Guia completo de CI/CD
- [INSTALL.md](./INSTALL.md) - Guia de instalação
- [.github/SECRETS.md](./.github/SECRETS.md) - Como configurar secrets
- [Chakra UI v3](https://v3.chakra-ui.com/) - Sistema de design
- [React Query](https://tanstack.com/query/latest) - State management
- [React Hook Form](https://react-hook-form.com/) - Formulários
- [Zod](https://zod.dev/) - Validação

### Componentes Principais

#### Atoms
- `Button` - Botão customizado
- `Input` - Input customizado

#### Molecules
- `BalanceCard` - Card de saldo
- `FormField` - Campo de formulário com label e erro
- `FormSelect` - Select customizado
- `StatusBadge` - Badge de status
- `RoleDisplay` - Display de role do usuário

#### Organisms
- `charts/` - Gráficos (Recharts)
- `dialogs/` - Modais e dialogs
- `forms/` - Formulários completos
- `lists/` - Listas de dados

### Hooks Disponíveis
- `useAuth()` - Autenticação
- `useTransactions()` - Transações
- `useAccounts()` - Contas
- `useCategories()` - Categorias
- `useDailyLimit()` - Limite diário
- `useAccountMembers()` - Membros da conta
- `useColorMode()` - Tema claro/escuro

---

## ⚠️ Avisos Importantes

### Código e Arquitetura
1. **SEMPRE use Chakra UI v3 syntax** - Verifique as regras no `.cursorrules`
2. **SEMPRE use React Query** para chamadas de API
3. **SEMPRE valide formulários** com Zod
4. **SEMPRE use TypeScript** - sem `any`
5. **SEMPRE siga Atomic Design** para componentes
6. **NUNCA use `@emotion/styled`** - removido no v3
7. **NUNCA use `useToast()`** - use `toaster.create()` do v3

### Git e CI/CD
8. **NUNCA faça push direto na branch main** - Sempre crie uma branch de feature
9. **SEMPRE busque atualizações da main** antes de criar nova branch
10. **SEMPRE execute validações localmente** antes de push - veja seção CI/CD
11. **SEMPRE verifique o CI** antes de merge no main
12. **NUNCA commite** secrets ou tokens

---

## 📝 Workflow Git (IMPORTANTE!)

### Regras de Branch

⚠️ **NUNCA faça push direto na branch `main`!**

### Workflow Correto

```bash
# 1. Sempre comece buscando atualizações da main
git checkout main
git pull origin main

# 2. Crie uma nova branch A PARTIR da main atualizada
git checkout -b feature/minha-feature

# 3. Faça suas alterações
# ... desenvolver ...

# 4. Valide localmente (OBRIGATÓRIO)
npm run type-check && npm run lint && npm test -- --run && npm run build

# 5. Commit e push DA SUA BRANCH
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/minha-feature

# 6. Abra Pull Request no GitHub
# O CI vai executar automaticamente

# 7. Após aprovação e CI verde, merge via GitHub
# Deploy automático será acionado
```

### Tipos de Branches

- **`main`** - Branch de produção (protegida, só via PR)
- **`develop`** - Branch de desenvolvimento (se houver)
- **`feature/*`** - Novas funcionalidades (ex: `feature/login`)
- **`fix/*`** - Correções de bugs (ex: `fix/button-hover`)
- **`chore/*`** - Manutenção (ex: `chore/update-deps`)
- **`docs/*`** - Documentação (ex: `docs/update-readme`)

### Exemplo Completo

```bash
# Situação: Quero adicionar validação de email

# 1. Atualizar main
git checkout main
git pull origin main

# 2. Criar branch de feature
git checkout -b feature/email-validation

# 3. Desenvolver
# ... código ...

# 4. Validar localmente
npm run type-check
npm run lint
npm test -- --run
npm run build

# 5. Commit
git add .
git commit -m "feat: adiciona validação de email no formulário de login"

# 6. Push da branch (NÃO da main!)
git push origin feature/email-validation

# 7. Criar PR no GitHub
# https://github.com/IgorGuariroba/bfin-frotend/pulls

# 8. Aguardar CI passar ✅

# 9. Merge via GitHub após aprovação
```

### ❌ Nunca Faça Isso

```bash
# ❌ ERRADO - Push direto na main
git checkout main
git add .
git commit -m "mudanças"
git push origin main

# ❌ ERRADO - Criar branch sem atualizar main
git checkout -b feature/nova-feature
# (sem fazer git pull da main antes)

# ❌ ERRADO - Merge local sem PR
git checkout main
git merge feature/minha-feature
git push origin main
```

### ✅ Sempre Faça Isso

```bash
# ✅ CORRETO
git checkout main                    # Vai para main
git pull origin main                 # Atualiza main
git checkout -b feature/nova-feature # Cria branch a partir da main atualizada
# ... desenvolver ...
git push origin feature/nova-feature # Push da branch (não da main!)
# ... criar PR no GitHub ...
# ... aguardar aprovação e CI ...
# ... merge via GitHub ...
```

---

## 🎯 Checklist para Novas Features

### Antes de Começar
- [ ] Atualizar branch main: `git checkout main && git pull origin main`
- [ ] Criar branch de feature: `git checkout -b feature/nome-da-feature`

### Durante o Desenvolvimento
- [ ] Componente criado na pasta correta (atoms/molecules/organisms)
- [ ] TypeScript types definidos
- [ ] Props documentadas
- [ ] Chakra UI v3 syntax usado corretamente
- [ ] React Query usado se houver chamadas de API
- [ ] Formulários validados com Zod
- [ ] Responsividade implementada
- [ ] Story do Storybook criada
- [ ] Testes escritos (se aplicável)
- [ ] Documentação atualizada

### Validações Locais (CI Pipeline)
```bash
# Execute TODOS antes de fazer push
npm run type-check     # ✅ TypeScript
npm run lint           # ✅ ESLint
npm test -- --run      # ✅ Testes
npm run build          # ✅ Build
npm audit              # ✅ Segurança
```

### Commit e Push
- [ ] Commit com mensagem descritiva (Conventional Commits)
- [ ] Push da branch de feature (NÃO da main!)
- [ ] Verificar se está na branch correta antes de push

### Após Push
- [ ] Abrir Pull Request no GitHub
- [ ] Verificar se o CI passou no GitHub Actions
- [ ] Corrigir erros do CI imediatamente (se houver)
- [ ] Aguardar aprovação de revisores
- [ ] Merge só após CI verde ✅
- [ ] Nunca fazer merge local - sempre via GitHub PR

---

## 📞 Contato e Suporte

- **GitHub**: [@igorguariroba](https://github.com/igorguariroba)
- **Documentação Completa**: Ver `DOCUMENTACAO.md`
- **Storybook Local**: http://localhost:6006

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0.0
