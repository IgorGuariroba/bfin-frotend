# Uso do MonetaryValueInput - Componente Padrão

Este documento mostra como usar o componente `MonetaryValueInput` para padronizar inputs de valor monetário nos formulários.

## Para formulários que usam `inputContent` (como ExpenseForm)

```tsx
import { MonetaryValueInput } from '../../molecules/MonetaryValueInput';

// No formulário
const [amountInputValue, setAmountInputValue] = useState('');

const handleAmountChange = (value: string, valueAsNumber: number) => {
  setAmountInputValue(value);
  // Registrar no React Hook Form
  setValue('amount', valueAsNumber, { shouldValidate: true });
};

// No JSX
<BaseForm
  // ... outras props
  displayValue={{
    inputContent: (
      <MonetaryValueInput
        value={amountInputValue}
        onValueChange={handleAmountChange}
        placeholder="R$ 0,00" // opcional
        min={0} // opcional
        step={0.01} // opcional
      />
    ),
  }}
>
  {/* conteúdo do formulário */}
</BaseForm>
```

## Para formulários que usam `displayValue.value` (como TransferForm, IncomeForm)

Estes formulários já usam um padrão consistente e não precisam ser alterados:

```tsx
// Padrão atual (mantido)
<BaseForm
  displayValue={{
    value: formatCurrency(amount),
    editable: true,
    onEdit: () => {
      // lógica de edição com modal
    },
  }}
>
```

## Vantagens da padronização

1. **Consistência visual**: Todos os inputs de valor monetário têm o mesmo estilo
2. **Comportamento unificado**: Formatação automática para BRL
3. **Manutenibilidade**: Mudanças no design precisam ser feitas em apenas um lugar
4. **Reutilização**: Componente pode ser usado em novos formulários que precisem do padrão `inputContent`

## Formulários refatorados

### IncomeForm (✅ Refatorado)
O IncomeForm foi refatorado de `displayValue.value` com modal de edição para usar o `MonetaryValueInput`:

```tsx
// Antes (padrão editable)
displayValue={{
  value: formatCurrency(amount),
  editable: true,
  onEdit: () => { /* modal logic */ }
}}

// Depois (padrão inputContent)
displayValue={{
  inputContent: (
    <MonetaryValueInput
      value={amountInputValue}
      onValueChange={handleAmountChange}
    />
  ),
}}
```

## Exemplo para novos formulários (Pagar, Depositar)

```tsx
// PaymentForm.tsx (exemplo)
import { MonetaryValueInput } from '../../molecules/MonetaryValueInput';

export function PaymentForm({ onCancel, onSuccess }) {
  const [amountValue, setAmountValue] = useState('');

  const handleAmountChange = (value: string, valueAsNumber: number) => {
    setAmountValue(value);
    setValue('amount', valueAsNumber, { shouldValidate: true });
  };

  return (
    <BaseForm
      title="Pagar Conta"
      icon={CreditCard}
      variant="red-header"
      displayValue={{
        inputContent: (
          <MonetaryValueInput
            value={amountValue}
            onValueChange={handleAmountChange}
          />
        ),
      }}
    >
      {/* campos do formulário */}
    </BaseForm>
  );
}
```