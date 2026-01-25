# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BFIN Frontend is a personal financial management web application built with React, TypeScript, and Chakra UI v3. It uses a private SDK (`@igorguariroba/bfin-sdk`) for backend communication and follows strict architectural patterns.

## Development Commands

```bash
# Setup (first time only)
npm run setup:npmrc        # Setup GitHub Packages authentication
npm run install:all        # Install dependencies with SDK access

# Development
npm run dev                # Start Vite dev server + Storybook concurrently
npm run dev:vite          # Start only Vite dev server (port 5173)
npm run dev:storybook     # Start only Storybook (port 6006)

# Testing
npm test                  # Run tests in watch mode
npm test -- --run        # Run tests once
npm run test:ui           # Run tests with UI
npm run test:coverage     # Run with coverage report

# Code Quality
npm run type-check        # TypeScript check without build
npm run lint              # ESLint check
npm run check:tokens      # Design tokens validation

# Build
npm run build             # Production build
npm run build:check       # TypeScript check + build
npm run preview           # Preview production build

# Storybook
npm run storybook         # Start Storybook dev server
npm run build-storybook   # Build Storybook for production
```

## Critical Architecture Rules

### 1. Chakra UI v3 Migration Requirements

**NEVER use v2 syntax** - This project uses Chakra UI v3 which has breaking changes:

- Component composition pattern: `Modal` → `Dialog.Root/Content/Header`
- Prop renames: `isOpen` → `open`, `isDisabled` → `disabled`, `colorScheme` → `colorPalette`
- Button icons: No `leftIcon`/`rightIcon` props, use children with icon components
- Toast system: Use `toaster.create()` instead of `useToast()`
- Form validation: Use `Field.Root/Label/ErrorText` pattern

**Always check `.cursorrules` for complete migration guide.**

### 2. Atomic Design Structure

Strictly follow component hierarchy:
- `components/atoms/` - Basic UI elements (Button, Input)
- `components/molecules/` - Simple combinations (FormField, BalanceCard)
- `components/organisms/` - Complex components with business logic (forms, charts, lists)
- `components/ui/` - Chakra UI v3 customizations
- `components/utils/` - UI utilities

**Never import higher-level components in lower levels.**

### 3. Private SDK Authentication

The project uses `@igorguariroba/bfin-sdk` from GitHub Packages:
- Requires `NPM_TOKEN` environment variable with GitHub token
- Run `npm run setup:npmrc` before installing dependencies
- SDK is configured in `src/config/sdk.ts` with auto token refresh

### 4. State Management Architecture

- **React Query** (`@tanstack/react-query`) for all server state
- **Custom hooks** in `src/hooks/` for business logic (useTransactions, useAccounts, etc.)
- **AuthContext** for authentication state
- **Local state** only for UI interactions

### 5. Type Safety Requirements

- All components must have TypeScript interfaces for props
- Use SDK types: `import type { User, Transaction } from '@igorguariroba/bfin-sdk'`
- No `any` types allowed
- Form validation with Zod schemas

## Development Workflow

### Git Branch Protection
- **NEVER push directly to `main`** - All changes via Pull Requests
- Branch from updated `main`, create feature branches
- CI must pass before merge (TypeScript, ESLint, tests, build)

### Local Validation (run before push)
```bash
npm run type-check && npm run lint && npm test -- --run && npm run build
```

### Authentication Setup
1. Create GitHub Personal Access Token with `read:packages` scope
2. Add to `.env`: `NPM_TOKEN=your_token_here`
3. Run `npm run setup:npmrc` before `npm install`

## Key Architecture Patterns

### Component Creation
```tsx
// Atomic Design component in correct folder
interface ButtonProps {
  children: React.ReactNode
  colorPalette?: 'orange' | 'blue' | 'green'
  loading?: boolean
  onClick?: () => void
}

export const Button = ({ children, colorPalette = 'orange', loading, onClick }: ButtonProps) => {
  return (
    <ChakraButton colorPalette={colorPalette} loading={loading} onClick={onClick}>
      {children}
    </ChakraButton>
  )
}
```

### Data Fetching
```tsx
// Custom hook pattern
export const useTransactions = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const api = getTransactions()
      return api.getApiV1Transactions()
    },
  })

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

### Form Handling
```tsx
// React Hook Form + Zod pattern
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

## Testing Strategy

- **Vitest** for unit tests with jsdom
- **Playwright** for browser/integration tests via Storybook
- **Storybook** for component documentation and visual testing
- Tests run in CI pipeline with coverage reporting

## Import Patterns

```tsx
// Chakra UI components
import { Button, Input, Box, Flex, Stack, Text } from '@chakra-ui/react'

// Custom UI components (relative imports)
import { Provider } from './components/ui/provider'
import { Toaster, toaster } from './components/ui/toaster'

// Icons (prefer lucide-react)
import { Mail, ChevronRight } from 'lucide-react'

// SDK types and functions
import type { User, Transaction } from '@igorguariroba/bfin-sdk'
import { getTransactions, getAuthentication } from '@igorguariroba/bfin-sdk'
```

## Environment Setup

Required environment variables:
- `NPM_TOKEN` - GitHub token for SDK access
- `VITE_API_BASE_URL` - Backend API URL (production only)

Development proxy routes `/api` to `http://localhost:3000` automatically.