## Why

O `IncomeFormFields` usa um `NativeSelect` inline para seleção de categoria, enquanto o `ExpenseForm` usa o componente molecular `CategorySelector` com Chakra UI v3 `Select.Root` e `Controller` do react-hook-form. Isso gera inconsistência visual e de UX entre os formulários, além de duplicar lógica de seleção de categoria.

## What Changes

- Tornar o `CategorySelector` genérico (atualmente tipado apenas para `ExpenseFormData`) para aceitar qualquer form data que tenha `categoryId`
- Substituir o bloco inline de `NativeSelect` de categoria no `IncomeFormFields` pelo componente `CategorySelector` reutilizável
- Remover imports e código de categoria inline não mais necessários no `IncomeFormFields`

## Capabilities

### New Capabilities

- `generic-category-selector`: Generalização do CategorySelector para ser reutilizável por qualquer formulário que possua campo categoryId

### Modified Capabilities

<!-- Nenhuma capability existente tem seus requisitos alterados -->

## Impact

- `src/components/molecules/CategorySelector.tsx` — tipo do `control` prop precisa ser genérico
- `src/components/organisms/forms/IncomeFormFields.tsx` — substituir NativeSelect inline pelo CategorySelector, ajustar props/imports
- `src/components/organisms/forms/ExpenseForm.tsx` — nenhuma mudança necessária (já usa CategorySelector)
- `src/hooks/useIncomeFormLogic.ts` — pode precisar expor `control` se ainda não expõe
