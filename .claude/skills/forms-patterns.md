# Formulários - React Hook Form + Zod + Registry Pattern

## 🎯 Nova Arquitetura Clean Code

**✅ NOVA REGRA**: Todos os formulários expandidos usam **Registry Pattern**
- Sem ternários aninhados no Dashboard
- Type-safe com constants centralizadas
- Configuração em um só lugar
- Extensível e manutenível

---

## 🏗️ Como Adicionar um Novo Formulário

### 1️⃣ **Definir Constant (se nova)**
```tsx
// src/types/ExpandedForms.ts
export const EXPANDED_FORMS = {
  // ... existentes
  MEU_NOVO_FORM: 'meu-novo-form',
} as const;
```

### 2️⃣ **Adicionar ao Registry**
```tsx
// src/components/forms/FormRegistry.tsx
export const FORM_REGISTRY: Record<string, FormConfig> = {
  // ... existentes
  [EXPANDED_FORMS.MEU_NOVO_FORM]: {
    component: MeuNovoFormComponent,
    props: {
      defaultValue: 'valor inicial',
      customProp: true,
    },
    // customWrapper: MeuWrapperPersonalizado (opcional)
  },
};
```

### 3️⃣ **Usar no Dashboard**
```tsx
// Qualquer lugar que precise abrir o formulário
import { EXPANDED_FORMS } from '../types/ExpandedForms';

// Com hook
const { openForm } = useExpandedForm();
openForm(EXPANDED_FORMS.MEU_NOVO_FORM);

// Ou diretamente
onFormSelect(EXPANDED_FORMS.MEU_NOVO_FORM);
```

**🎉 Pronto! Zero modificações no Dashboard.tsx**

---

## 📝 Setup Padrão de Formulário

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Field, Input, Button } from '@chakra-ui/react'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

interface MeuFormProps {
  onCancel: () => void;     // ✅ OBRIGATÓRIO - Registry injeta automaticamente
  onSuccess?: () => void;   // ✅ OBRIGATÓRIO - Registry injeta automaticamente
  customProp?: string;      // Props específicas via registry
}

export const MeuForm = ({ onCancel, onSuccess, customProp }: MeuFormProps) => {
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
      onSuccess?.() // ✅ Registry injeta closeForm automaticamente
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

---

## 🔄 Hook useExpandedForm

### Uso Básico
```tsx
import { useExpandedForm } from '../hooks/useExpandedForm';
import { EXPANDED_FORMS } from '../types/ExpandedForms';

export const Dashboard = () => {
  // ✅ NOVO: Hook centralizado
  const {
    expandedForm,
    openForm,
    closeForm,
    hasOpenForm,
    openExtrato,           // Métodos de conveniência
    openAllTransactions,
  } = useExpandedForm();

  return (
    <div>
      {/* ✅ NOVO: Renderizador Clean */}
      <ExpandedFormRenderer
        expandedForm={expandedForm}
        onClose={closeForm}
        extraProps={{
          invitationsCount: invitations.length,
          onOpenInvitations: () => setInvitationsOpen(true)
        }}
      />

      {/* Dashboard normal */}
      {!hasOpenForm && <WidgetManager onExpandForm={openForm} />}

      {/* Footer com forms */}
      <FooterActions onFormSelect={openForm} />
    </div>
  );
};
```

### Métodos Disponíveis
```tsx
// Abrir qualquer formulário
openForm(EXPANDED_FORMS.PAGAR)
openForm(EXPANDED_FORMS.CALENDARIO)

// Métodos específicos
openExtrato()
openAllTransactions()

// Fechar atual
closeForm()

// Verificações
hasOpenForm                    // boolean
isFormOpen(EXPANDED_FORMS.PAGAR)  // boolean
expandedForm                   // atual ou null
```

---

## 🎨 Wrappers Customizados

### Para casos especiais (ex: Calendário)
```tsx
// src/components/forms/FormRegistry.tsx
function CalendarWrapper({ children, onCancel }: WrapperProps) {
  return (
    <VStack gap={0} align="stretch" minH="100vh">
      <Box bg="var(--primary)" px={6} py={6}>
        <Flex align="center" gap={4} mb={6}>
          <IconButton onClick={onCancel}>
            <ArrowLeft />
          </IconButton>
          <Heading color="white">Calendário de Contas</Heading>
        </Flex>
        {children}
      </Box>
    </VStack>
  );
}

export const FORM_REGISTRY = {
  [EXPANDED_FORMS.CALENDARIO]: {
    component: CalendarForm,
    customWrapper: CalendarWrapper,  // ✅ Wrapper especial
  },
};
```

---

## 📋 Schemas Comuns

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

---

## 🔌 Integração com React Query

```tsx
export const TransactionForm = ({ onCancel, onSuccess }: FormProps) => {
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      reset()
      toaster.create({
        title: "Transação criada!",
        type: "success",
      })
      onSuccess?.() // ✅ Registry fecha automaticamente
    },
    onError: () => {
      // ❌ NÃO chama onCancel em erro
      toaster.create({
        title: "Erro ao criar transação",
        type: "error",
      })
    }
  })

  return (
    <form onSubmit={handleSubmit(data => createMutation.mutate(data))}>
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

---

## 🚫 ~~Padrões OBSOLETOS~~

### ❌ NUNCA MAIS faça isso:
```tsx
// ❌ OBSOLETO: Ternários aninhados no Dashboard
{expandedForm === 'pagar' ? (
  <ExpenseForm onCancel={() => setExpandedForm(null)} />
) : expandedForm === 'depositar' ? (
  <IncomeForm onCancel={() => setExpandedForm(null)} />
) : null}

// ❌ OBSOLETO: Magic strings
setExpandedForm('pagar')
setExpandedForm('depositar')

// ❌ OBSOLETO: Props repetidas
onCancel={() => setExpandedForm(null)}
onSuccess={() => setExpandedForm(null)}
```

### ✅ NOVO padrão:
```tsx
// ✅ Registry Pattern
<ExpandedFormRenderer expandedForm={expandedForm} onClose={closeForm} />

// ✅ Type-safe constants
openForm(EXPANDED_FORMS.PAGAR)

// ✅ Props injetadas automaticamente
// Registry cuida de onCancel e onSuccess
```

---

## ⚠️ Regras Clean Code

### **OBRIGATÓRIAS**
1. **SEMPRE use Registry Pattern** para formulários expandidos
2. **SEMPRE use EXPANDED_FORMS constants** - nunca strings hardcoded
3. **SEMPRE use useExpandedForm hook** para gerenciar estado
4. **SEMPRE implemente onCancel e onSuccess** nos formulários
5. **SEMPRE use Zod** para validação
6. **SEMPRE use Field.Root** para campos do Chakra UI v3

### **PROIBIDAS**
7. **NUNCA modifique Dashboard.tsx** para adicionar formulários
8. **NUNCA use ternários aninhados** para renderização condicional
9. **NUNCA use setExpandedForm** diretamente - use openForm/closeForm
10. **NUNCA crie layouts de header manual** - use BaseForm ou customWrapper

### **RECOMENDADAS**
11. **SEMPRE trate loading** nos botões de submit
12. **SEMPRE invalide queries** após mutations
13. **SEMPRE teste componentes** com responsabilidades críticas
14. **SEMPRE use TypeScript** com tipagem completa