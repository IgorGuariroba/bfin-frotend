## Why

O componente `SelectField` redimensiona (encolhe) ao selecionar um item, quebrando o layout dos formulários. O comportamento esperado é que o select mantenha largura fixa independentemente do conteúdo selecionado. Isso afeta todos os formulários que usam `SelectField` e `CategorySelector`, impactando diretamente a experiência do usuário.

## What Changes

- Corrigir o componente `SelectField` para manter largura consistente antes e depois da seleção
- Garantir que `Field.Root` e containers intermediários ocupem 100% da largura disponível
- Ajustar `CategorySelector` para que o `SelectField` dentro do `HStack` use `flex={1}` e não encolha

## Capabilities

### New Capabilities

- `select-fixed-width`: Garantir que o componente SelectField mantenha largura fixa (100% do container) independentemente do estado de seleção

### Modified Capabilities

## Impact

- `src/components/molecules/SelectField.tsx` — componente principal a ser corrigido
- `src/components/molecules/CategorySelector.tsx` — pode precisar de ajuste no layout HStack
- Todos os formulários que usam `SelectField` ou `CategorySelector` serão beneficiados automaticamente
