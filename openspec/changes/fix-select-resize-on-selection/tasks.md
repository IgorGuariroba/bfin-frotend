## 1. Correção do SelectField

- [x] 1.1 Adicionar `width="full"` ao `Field.Root` no componente `SelectField` (`src/components/molecules/SelectField.tsx`)

## 2. Correção do CategorySelector

- [x] 2.1 Adicionar `flex={1}` ao `SelectField` dentro do `HStack` no `CategorySelector` (`src/components/molecules/CategorySelector.tsx`), garantindo que o select ocupe o espaço restante ao lado do botão

## 3. Validação

- [x] 3.1 Verificar visualmente que o select de Categoria não encolhe após seleção no `IncomeFormFields`
- [x] 3.2 Verificar visualmente que o select de Frequência da Recorrência não encolhe após seleção no `IncomeFormFields`
- [x] 3.3 Verificar que outros formulários que usam `SelectField` mantêm comportamento correto
