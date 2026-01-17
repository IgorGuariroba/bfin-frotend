# 🧩 Guia de Componentes

Nossos componentes são organizados seguindo o **Atomic Design**. Abaixo estão exemplos de uso dos componentes principais.

## Atoms (Componentes Básicos)

### Button
Componente básico de ação.
```tsx
import { Button } from '@/components/atoms/Button'

<Button colorPalette="orange" onClick={handleClick}>
  Clique aqui
</Button>
```

### Input
Campo de entrada de texto padronizado.
```tsx
import { Input } from '@/components/atoms/Input'

<Input placeholder="Nome completo" {...register('name')} />
```

## Molecules (Composições Simples)

### FormField
Combina Label, Input e mensagem de erro.
```tsx
import { FormField } from '@/components/molecules/FormField'

<FormField
  label="Email"
  error={errors.email?.message}
  {...register('email')}
/>
```

### BalanceCard
Card para exibição de valores financeiros.
```tsx
import { BalanceCard } from '@/components/molecules/BalanceCard'

<BalanceCard title="Saldo" value={1500.50} variant="success" />
```

### StatusBadge
Badge visual para estados (ativo, pendente, etc).
```tsx
<StatusBadge status="active" />
```

## Organisms (Componentes Complexos)

### TransactionList
Lista de transações integrada com a lógica de busca e filtros.

### Charts
Componentes de visualização (`SpendingHistoryChart`) localizados em `src/components/organisms/charts`.

### Forms
Formulários completos de lógica de negócio (`IncomeForm`, `FixedExpenseForm`) localizados em `src/components/organisms/forms`.
