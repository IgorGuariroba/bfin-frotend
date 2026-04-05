## Why

O componente `SelectField` reduz seu tamanho (width) quando o usuário seleciona um item, causando truncamento do texto exibido (ex: "Salario" vira "Sal..."). Isso prejudica a UX pois o campo deveria manter largura consistente independente do estado selecionado ou não.

## What Changes

- Corrigir o `SelectField` para manter largura fixa (`width: 100%`) em todos os estados (vazio, selecionado, com placeholder)
- Garantir que o texto do valor selecionado não seja truncado, ocupando todo o espaço disponível no trigger
- Ajustar a estrutura do `Select.Trigger` e `Select.ValueText` para que o layout não colapse ao receber um valor

## Capabilities

### New Capabilities

_Nenhuma nova capability - trata-se de correção de bug visual._

### Modified Capabilities

_Nenhuma capability existente modificada em nível de spec._

## Impact

- **Código afetado**: `src/components/molecules/SelectField.tsx`
- **Componentes dependentes**: `CategorySelector`, `IncomeFormFields` e qualquer formulário que use `SelectField`
- **Risco**: Baixo - correção puramente visual/CSS, sem mudança de API ou comportamento funcional
