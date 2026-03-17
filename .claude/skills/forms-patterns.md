# Formulários - React Hook Form + Zod

## Setup Padrão

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>
```

## Componente Formulário

```tsx
export const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      await submitForm(data)
      reset()
    } catch (error) {
      // handle error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field.Root invalid={!!errors.email}>
        <Field.Label>Email</Field.Label>
        <Input
          {...register('email')}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <Field.ErrorText>{errors.email.message}</Field.ErrorText>
        )}
      </Field.Root>

      <Button
        type="submit"
        loading={isSubmitting}
        colorPalette="orange"
      >
        Salvar
      </Button>
    </form>
  )
}
```

## Schemas Comuns

### Login
```tsx
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})
```

### Transação
```tsx
const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
  date: z.date(),
  type: z.enum(['income', 'expense']),
})
```

### Receita/Despesa
```tsx
const incomeSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
  isFixed: z.boolean().default(false),
  frequency: z.enum(['monthly', 'weekly', 'yearly']).optional(),
})
```

## Campos Customizados

### Select com Validação
```tsx
<Field.Root invalid={!!errors.category}>
  <Field.Label>Categoria</Field.Label>
  <NativeSelect {...register('category')}>
    <option value="">Selecione...</option>
    {categories.map(cat => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </NativeSelect>
  {errors.category && (
    <Field.ErrorText>{errors.category.message}</Field.ErrorText>
  )}
</Field.Root>
```

### Input com Máscara
```tsx
<Field.Root invalid={!!errors.amount}>
  <Field.Label>Valor</Field.Label>
  <Input
    {...register('amount', { valueAsNumber: true })}
    type="number"
    step="0.01"
    placeholder="0,00"
  />
  {errors.amount && (
    <Field.ErrorText>{errors.amount.message}</Field.ErrorText>
  )}
</Field.Root>
```

## Integração com React Query

```tsx
export const TransactionForm = () => {
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      reset()
      toaster.create({
        title: "Transação criada!",
        type: "success",
      })
    },
  })

  const onSubmit = (data: TransactionData) => {
    createMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* campos */}
      <Button
        type="submit"
        loading={createMutation.isPending}
      >
        Salvar
      </Button>
    </form>
  )
}
```

## Padrões Dashboard-First

### Form Container
```tsx
interface FormContainerProps {
  title: string
  onCancel: () => void
  children: React.ReactNode
}

export const FormContainer = ({ title, onCancel, children }: FormContainerProps) => {
  return (
    <Box p={4}>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">{title}</Heading>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </HStack>
      {children}
    </Box>
  )
}
```

### Uso no Dashboard
```tsx
case 'nova-transacao':
  return (
    <FormContainer
      title="Nova Transação"
      onCancel={() => setExpandedForm(null)}
    >
      <TransactionForm />
    </FormContainer>
  )
```

## Migração para BaseForm — Registro no Dashboard

Quando um form é migrado para usar `BaseForm` (com header e navegação próprios), o Dashboard precisa ser atualizado em **dois lugares**:

### 1. Remover do `hasGreenHeader` e adicionar ao `usesBaseForm`

```tsx
// ANTES
const hasGreenHeader = expandedForm === 'depositar' || ...;
const usesBaseForm = expandedForm === 'emprestimos' || ...;

// DEPOIS (BaseForm cuida do próprio header)
const hasGreenHeader = ...; // sem 'depositar'
const usesBaseForm = expandedForm === 'depositar' || expandedForm === 'emprestimos' || ...;
```

### 2. Renderizar diretamente (fora do `getContent()`)

```tsx
// ANTES — dentro de getContent() → nunca use isso para forms com BaseForm
case 'depositar':
  return (
    <IncomeForm
      onSuccess={() => setExpandedForm(null)}
      onCancel={() => setExpandedForm(null)}
    />
  );

// DEPOIS — renderizado diretamente no bloco de condicionais
} : expandedForm === 'depositar' ? (
  <IncomeForm
    onSuccess={() => setExpandedForm(null)}
    onCancel={() => setExpandedForm(null)}
  />
) : expandedForm === 'emprestimos' ? (
```

> **Por que?** Forms com `BaseForm` têm header verde próprio. Se renderizados via `getContent()`, o Dashboard envolveria em outro header verde — causando **duplo header**. Forms com `BaseForm` devem ser renderizados diretamente, como `LoanForm` e `DailyLimitForm`.

### Também remover o título morto de `getTitle()`

```tsx
// Remover — vira código morto após a migração
case 'depositar': return 'Depositar';
```

## ⚠️ Regras Importantes

1. **SEMPRE use Zod** para validação
2. **SEMPRE use Field.Root** para campos
3. **SEMPRE trate loading** nos botões de submit
4. **SEMPRE invalide queries** após mutations
5. **SEMPRE siga Dashboard-First** - forms no Dashboard!
6. **Forms com BaseForm** devem ser renderizados diretamente no Dashboard, nunca via `getContent()`