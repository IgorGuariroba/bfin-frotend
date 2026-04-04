## 1. Generalizar CategorySelector

- [x] 1.1 Alterar `CategorySelector` para usar generic `T extends FieldValues` no tipo do `control` prop, substituindo `Control<ExpenseFormData>` por `Control<T>`
- [x] 1.2 Importar `FieldValues` e `Path` de `react-hook-form` e ajustar interface `CategorySelectorProps<T>`
- [x] 1.3 Verificar que o `ExpenseForm` continua compilando sem alterações

## 2. Expor control no useIncomeFormLogic

- [x] 2.1 Adicionar `control: form.control` ao retorno direto e ao objeto `form` do hook `useIncomeFormLogic`

## 3. Integrar CategorySelector no IncomeFormFields

- [x] 3.1 Adicionar prop `control` na interface `IncomeFormFieldsProps` com tipo `Control<IncomeFormData>`
- [x] 3.2 Substituir o bloco de `NativeSelect` de categoria (linhas 91-140) pelo componente `CategorySelector`
- [x] 3.3 Remover imports não mais utilizados (`NativeSelect`, `Tag`, `Plus`, `IconButton` se não usados em outro lugar)
- [x] 3.4 Passar `control` do `IncomeForm` → `IncomeFormFields` → `CategorySelector`

## 4. Validação

- [x] 4.1 Executar `npm run build` e garantir zero erros de compilação
- [x] 4.2 Validar que o tipo `IncomeFormData` exportado é compatível com o generic do `CategorySelector`
