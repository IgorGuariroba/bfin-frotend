## 1. Criar componente FormSelect

- [x] 1.1 Criar `src/components/molecules/SelectField.tsx` com props genéricas (control, name, label, placeholder, icon, items, error) usando Chakra UI v3 Select + Controller + Portal com o padrão visual do CategorySelector
- [x] 1.2 Exportar SelectField no barrel file

## 2. Refatorar CategorySelector

- [x] 2.1 Refatorar `src/components/molecules/CategorySelector.tsx` para usar FormSelect internamente, mantendo botão "+" e lógica de validação de conta

## 3. Substituir NativeSelect no IncomeFormFields

- [x] 3.1 Substituir o `NativeSelect` de "Frequência de Recorrência" em `src/components/organisms/forms/IncomeFormFields.tsx` pelo FormSelect com ícone Zap e opções (Mensal, Semanal, Anual)
- [x] 3.2 Remover imports não utilizados de `NativeSelect` do IncomeFormFields

## 4. Validação

- [x] 4.1 Verificar que o build compila sem erros (`npm run build`)
- [x] 4.2 Testar visualmente que CategorySelector e select de recorrência têm aparência idêntica
