# 📝 BaseForm - Componente Padrão para Formulários

O `BaseForm` é um componente base para padronização de todos os formulários no BFIN Frontend, mantendo consistência visual, comportamento e UX em toda a aplicação.

## 🎯 Benefícios

- ✅ **Consistência Visual**: Layout padronizado para todos os formulários
- ✅ **Estados Padrão**: Loading, erro e sucesso automatizados
- ✅ **Responsividade**: Adaptação automática para mobile e desktop
- ✅ **Acessibilidade**: Navegação e controles acessíveis
- ✅ **Variantes**: Diferentes layouts para diferentes contextos
- ✅ **DRY**: Elimina repetição de código entre formulários

## 🚀 Como usar

### 1. Import
```tsx
import { BaseForm } from '../../ui/BaseForm';
```

### 2. Uso Básico - Formulário Financeiro (Header Verde)
```tsx
<BaseForm
  title="Nova Despesa"
  subtitle="Registre um novo gasto"
  icon={DollarSign}
  variant="green-header"
  displayValue={{
    value: 'R$ 150,00',
    label: 'Valor da despesa',
    editable: true,
    onEdit: () => setIsEditingAmount(true)
  }}
  onBack={onCancel}
  primaryAction={{
    label: 'Salvar Despesa',
    onClick: handleSubmit,
    loading: isSubmitting
  }}
  actions={[
    {
      label: 'Cancelar',
      onClick: onCancel,
      variant: 'outline'
    }
  ]}
>
  {/* Seus campos de formulário aqui */}
  <VStack gap={4} px={{ base: 4, md: 6 }}>
    <Field.Root>
      <Field.Label>Descrição</Field.Label>
      <Input placeholder="Ex: Supermercado..." />
    </Field.Root>

    <Field.Root>
      <Field.Label>Categoria</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field placeholder="Selecione...">
          <option value="alimentacao">Alimentação</option>
        </NativeSelect.Field>
      </NativeSelect.Root>
    </Field.Root>
  </VStack>
</BaseForm>
```

### 3. Uso Avançado - Container Branco
```tsx
<BaseForm
  title="Editar Perfil"
  icon={User}
  variant="white-container"
  backButtonVariant="x"
  onCancel={onCancel}
  primaryAction={{
    label: 'Salvar',
    onClick: handleSave
  }}
>
  <VStack gap={4}>
    <Field.Root>
      <Field.Label>Nome</Field.Label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
    </Field.Root>
  </VStack>
</BaseForm>
```

## 📋 Props Interface

```tsx
interface BaseFormProps {
  // Header
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;

  // Value display (para formulários financeiros)
  displayValue?: {
    value: string;
    label?: string;
    editable?: boolean;
    onEdit?: () => void;
  };

  // Navigation
  onBack?: () => void;
  onCancel?: () => void;
  showBackButton?: boolean;
  backButtonVariant?: 'arrow' | 'x';

  // Content
  children?: React.ReactNode;

  // Actions
  actions?: BaseFormAction[];
  primaryAction?: BaseFormAction;

  // States
  isLoading?: boolean;
  error?: string | null;

  // Layout variants
  variant?: 'green-header' | 'white-container' | 'fullscreen';

  // Form specific
  formId?: string;
  onSubmit?: (e: React.FormEvent) => void;
}
```

## 🎨 Variantes

### 1. `green-header` (Padrão para formulários financeiros)
- Header verde com valor em destaque
- Usado para: Despesas, Receitas, Transferências, Limites
- Footer fixo com ações
- Animação de expansão do Dashboard

### 2. `white-container`
- Container branco simples com card
- Usado para: Configurações, Perfil, Formulários simples
- Ações inline no card
- Centralizado na tela

### 3. `fullscreen`
- Tela cheia sem container
- Usado para: Formulários especiais como Extrato
- Máxima flexibilidade de layout

## 🔄 Refatorando Formulários Existentes

### Antes (Formulário manual)
```tsx
export function MyForm({ onCancel }: Props) {
  return (
    <VStack gap={0} align="stretch" minH="100vh" pb={8}>
      {/* Header Verde manual */}
      <Box bg="var(--primary)" px={4} py={6}>
        <Flex align="center" gap={4} mb={6}>
          <IconButton onClick={onCancel}>
            <ArrowLeft size={20} />
          </IconButton>
          <Heading color="var(--primary-foreground)">
            Meu Formulário
          </Heading>
        </Flex>

        <Text fontSize="4xl" color="var(--primary-foreground)">
          R$ 150,00
        </Text>
      </Box>

      {/* Content manual */}
      <Box px={4}>
        {/* campos... */}
      </Box>

      {/* Footer manual */}
      <Box position="fixed" bottom={0} p={4}>
        <Button onClick={handleSubmit}>Salvar</Button>
      </Box>
    </VStack>
  );
}
```

### Depois (Com BaseForm)
```tsx
export function MyForm({ onCancel }: Props) {
  return (
    <BaseForm
      title="Meu Formulário"
      variant="green-header"
      displayValue={{ value: 'R$ 150,00' }}
      onBack={onCancel}
      primaryAction={{
        label: 'Salvar',
        onClick: handleSubmit
      }}
    >
      <VStack gap={4} px={4}>
        {/* campos... */}
      </VStack>
    </BaseForm>
  );
}
```

## ✅ Checklist de Migração

Ao refatorar um formulário existente:

- [ ] Identificar a variante correta (`green-header` vs `white-container`)
- [ ] Extrair título, ícone e valor do header manual
- [ ] Mover botões de ação para `actions` e `primaryAction`
- [ ] Configurar `onBack`/`onCancel` adequadamente
- [ ] Testar responsividade mobile/desktop
- [ ] Verificar estados de loading e erro
- [ ] Validar acessibilidade (navegação por teclado)

## 🎯 Exemplos Práticos

### Formulários Financeiros
- `IncomeForm` → `variant="green-header"` + `displayValue`
- `ExpenseForm` → `variant="green-header"` + `displayValue`
- `TransferForm` → `variant="green-header"` + `displayValue`
- `DailyLimitForm` → `variant="green-header"` + `displayValue`

### Formulários de Configuração
- `CreateAccountForm` → `variant="white-container"`
- Perfil/Configurações → `variant="white-container"`
- Dialogs simples → `variant="white-container"`

### Formulários Especiais
- `ExtratoForm` → `variant="fullscreen"`
- `AllTransactionsForm` → `variant="fullscreen"`

## 📚 Ver Também

- **Storybook**: `src/components/ui/BaseForm.stories.tsx`
- **Exemplo Refatorado**: `src/components/organisms/forms/DailyLimitFormRefactored.tsx`
- **BaseWidget**: Inspiração para widgets (similar ao BaseForm)

---

**🎯 Objetivo**: Todos os formulários do BFIN devem migrar gradualmente para usar o BaseForm, mantendo consistência visual e de comportamento em toda a aplicação.