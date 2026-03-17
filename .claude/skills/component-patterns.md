# Component Patterns - Atomic Design

## 🏗️ Hierarquia Atomic Design

```
components/
├── atoms/           # Componentes básicos
├── molecules/       # Composições simples
├── organisms/       # Componentes complexos
├── ui/             # Chakra UI customizados
└── utils/          # Componentes utilitários
```

**REGRA**: Nunca importe nível superior em inferior (ex: Organism em Atom)

---

## ⚛️ Atoms - Componentes Básicos

### Button Atom
```tsx
// components/atoms/Button.tsx
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react'

interface ButtonProps extends ChakraButtonProps {
  variant?: 'solid' | 'outline' | 'ghost'
  loading?: boolean
}

export const Button = ({
  children,
  variant = 'solid',
  loading,
  colorPalette = 'orange',
  ...props
}: ButtonProps) => {
  return (
    <ChakraButton
      variant={variant}
      loading={loading}
      colorPalette={colorPalette}
      {...props}
    >
      {children}
    </ChakraButton>
  )
}
```

### Input Atom
```tsx
// components/atoms/Input.tsx
import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react'

interface InputProps extends ChakraInputProps {
  error?: boolean
}

export const Input = ({ error, ...props }: InputProps) => {
  return (
    <ChakraInput
      invalid={error}
      {...props}
    />
  )
}
```

---

## 🧬 Molecules - Composições Simples

### FormField Molecule
```tsx
// components/molecules/FormField.tsx
import { Field } from '@chakra-ui/react'
import { Input } from '../atoms/Input'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children?: React.ReactNode
}

export const FormField = ({
  label,
  error,
  required,
  children
}: FormFieldProps) => {
  return (
    <Field.Root invalid={!!error} required={required}>
      <Field.Label>{label}</Field.Label>
      {children}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  )
}
```

### BalanceCard Molecule
```tsx
// components/molecules/BalanceCard.tsx
import { Card, Text, VStack, HStack } from '@chakra-ui/react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface BalanceCardProps {
  title: string
  amount: number
  type: 'income' | 'expense' | 'balance'
}

export const BalanceCard = ({ title, amount, type }: BalanceCardProps) => {
  const color = type === 'income' ? 'green' : type === 'expense' ? 'red' : 'blue'
  const Icon = type === 'income' ? TrendingUp : TrendingDown

  return (
    <Card.Root>
      <Card.Body>
        <VStack align="start">
          <HStack>
            {type !== 'balance' && <Icon size={16} />}
            <Text fontSize="sm" color="gray.500">
              {title}
            </Text>
          </HStack>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={`${color}.500`}
          >
            R$ {amount.toFixed(2)}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
```

### StatusBadge Molecule
```tsx
// components/molecules/StatusBadge.tsx
import { Badge } from '@chakra-ui/react'

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending'
  children: React.ReactNode
}

export const StatusBadge = ({ status, children }: StatusBadgeProps) => {
  const colorMap = {
    active: 'green',
    inactive: 'gray',
    pending: 'orange'
  }

  return (
    <Badge colorPalette={colorMap[status]}>
      {children}
    </Badge>
  )
}
```

---

## 🦠 Organisms - Componentes Complexos

### TransactionForm Organism
```tsx
// components/organisms/forms/TransactionForm.tsx
import { VStack, HStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'
import { Input } from '../../atoms/Input'
import { useTransactions } from '@/hooks/useTransactions'

const schema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
})

type FormData = z.infer<typeof schema>

interface TransactionFormProps {
  onCancel: () => void
}

export const TransactionForm = ({ onCancel }: TransactionFormProps) => {
  const { createTransaction, isCreating } = useTransactions()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    createTransaction({
      ...data,
      date: new Date().toISOString(),
      type: 'expense'
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={4}>
        <FormField
          label="Descrição"
          error={errors.description?.message}
          required
        >
          <Input {...register('description')} />
        </FormField>

        <FormField
          label="Valor"
          error={errors.amount?.message}
          required
        >
          <Input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="0.01"
          />
        </FormField>

        <HStack justify="end" width="full">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isCreating}
            colorPalette="orange"
          >
            Salvar
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}
```

### TransactionList Organism
```tsx
// components/organisms/lists/TransactionList.tsx
import { VStack, Text, Spinner } from '@chakra-ui/react'
import { useTransactions } from '@/hooks/useTransactions'
import { BalanceCard } from '../../molecules/BalanceCard'

export const TransactionList = () => {
  const { transactions, isLoading } = useTransactions()

  if (isLoading) {
    return <Spinner />
  }

  if (transactions.length === 0) {
    return (
      <Text color="gray.500" textAlign="center">
        Nenhuma transação encontrada
      </Text>
    )
  }

  return (
    <VStack gap={3} align="stretch">
      {transactions.map(transaction => (
        <BalanceCard
          key={transaction.id}
          title={transaction.description}
          amount={transaction.amount}
          type={transaction.type}
        />
      ))}
    </VStack>
  )
}
```

---

## 📝 TypeScript Patterns

### Props Interface
```tsx
// Base props
interface BaseProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

// Component specific props
interface ButtonProps extends BaseProps {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}
```

### Generic Components
```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
}

export const List = <T,>({ items, renderItem, emptyMessage }: ListProps<T>) => {
  if (items.length === 0) {
    return <Text>{emptyMessage || 'Lista vazia'}</Text>
  }

  return (
    <VStack>
      {items.map((item, index) => renderItem(item, index))}
    </VStack>
  )
}
```

### Event Handlers
```tsx
interface FormProps {
  onSubmit: (data: FormData) => void
  onCancel: () => void
  onValidationError: (errors: FormErrors) => void
}
```

---

## 🎨 Styling Patterns

### Responsive Props
```tsx
<Box
  width={{ base: "100%", md: "50%", lg: "33%" }}
  padding={{ base: 4, md: 6, lg: 8 }}
  fontSize={{ base: "sm", md: "md" }}
>
  Content
</Box>
```

### Color Palette
```tsx
// Tema do projeto
const theme = {
  primary: 'orange',
  success: 'green',
  danger: 'red',
  warning: 'yellow',
  info: 'blue',
}

<Button colorPalette={theme.primary}>Save</Button>
```

### Conditional Styling
```tsx
const StatusText = ({ status, children }) => (
  <Text
    color={status === 'active' ? 'green.500' : 'gray.500'}
    fontWeight={status === 'active' ? 'bold' : 'normal'}
  >
    {children}
  </Text>
)
```

---

## 📦 Nomenclatura de Arquivos

### Componentes
```
Button.tsx              # PascalCase
FormField.tsx           # PascalCase
TransactionList.tsx     # PascalCase
```

### Hooks
```
useTransactions.ts      # camelCase + use prefix
useAuth.ts              # camelCase + use prefix
useCategories.ts        # camelCase + use prefix
```

### Services/Utils
```
transactionService.ts   # camelCase + Service suffix
dateUtils.ts            # camelCase + Utils suffix
apiClient.ts            # camelCase
```

### Types
```
transactionTypes.ts     # camelCase + Types suffix
userTypes.ts            # camelCase + Types suffix
```

---

## 🧪 Testing Patterns

### Component Test
```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('deve renderizar corretamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## ⚠️ Regras Importantes

1. **SEMPRE siga a hierarquia Atomic Design**
2. **NUNCA importe nível superior em inferior**
3. **SEMPRE defina tipos TypeScript para props**
4. **SEMPRE use naming conventions consistentes**
5. **SEMPRE trate casos de loading e error**
6. **SEMPRE teste componentes críticos**
7. **SEMPRE siga Dashboard-First** para organisms/forms