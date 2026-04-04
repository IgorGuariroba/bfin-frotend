## Why

O formulário IncomeFormFields usa dois padrões visuais diferentes para selects: o CategorySelector usa o componente `Select` do Chakra UI v3 com Controller (estilizado com ícone, borderRadius full, portal dropdown), enquanto o select de "Frequência de Recorrência" usa `NativeSelect` com estilo diferente. Isso quebra a consistência visual do sistema. Precisamos unificar usando o mesmo padrão do CategorySelector.

## What Changes

- Criar um componente genérico de select reutilizável baseado no padrão visual do CategorySelector (Chakra UI v3 `Select` com Controller, Portal, ícone à esquerda, borderRadius full)
- Substituir o `NativeSelect` de frequência de recorrência no IncomeFormFields pelo novo componente genérico
- Refatorar o CategorySelector para usar o componente genérico internamente (mantendo sua lógica específica de categorias)

## Capabilities

### New Capabilities
- `generic-select`: Componente select genérico reutilizável com design padronizado (ícone, borderRadius full, Portal dropdown, integração com react-hook-form via Controller)

### Modified Capabilities

## Impact

- `src/components/molecules/CategorySelector.tsx` — pode ser simplificado para usar o componente genérico
- `src/components/organisms/forms/IncomeFormFields.tsx` — substituição do NativeSelect por componente genérico
- Novo arquivo em `src/components/molecules/` para o componente genérico
- Outros formulários que usem selects no futuro se beneficiarão da padronização
