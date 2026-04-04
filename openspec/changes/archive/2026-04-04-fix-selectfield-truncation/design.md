## Context

O componente `SelectField` (`src/components/molecules/SelectField.tsx`) usa Chakra UI v3 `Select` com layout baseado em `Select.Root > Select.Control > Select.Trigger > Select.ValueText`. Atualmente, quando um valor é selecionado, o trigger colapsa sua largura, truncando o texto visível (ex: "Salário" → "Sal...").

O problema ocorre porque o `Select.ValueText` dentro do `Select.Trigger` não possui constraints de largura adequadas, e o Chakra v3 Select por padrão permite que o trigger se ajuste ao conteúdo quando um valor é selecionado.

## Goals / Non-Goals

**Goals:**
- O `SelectField` DEVE manter largura `100%` do container pai em todos os estados
- O texto do valor selecionado DEVE ser exibido por completo, sem truncamento
- A correção deve funcionar para todos os usos existentes (`CategorySelector`, `IncomeFormFields`)

**Non-Goals:**
- Não redesenhar o componente ou alterar sua API
- Não adicionar funcionalidades novas (busca, multi-select, etc.)

## Decisions

**Decisão 1: Forçar `width: 100%` no `Select.Trigger` e garantir `flex: 1` no `Select.ValueText`**

O Chakra UI v3 Select pode colapsar o trigger ao selecionar um valor porque o `ValueText` não expande para preencher o espaço. A solução é:
1. Manter `width="full"` no `Select.Trigger` (já existe)
2. Adicionar `minWidth={0}` e `flex={1}` no `Select.ValueText` para evitar que o texto force o colapso
3. Garantir `overflow="hidden"` e `textOverflow="ellipsis"` apenas como fallback para textos muito longos, mas com largura fixa do container

**Alternativa descartada**: Usar `width` fixo em pixels — não seria responsivo.

## Risks / Trade-offs

- **[Baixo]** Possível variação visual entre browsers → Mitigação: propriedades CSS padrão bem suportadas
- **[Baixo]** Textos extremamente longos ainda terão ellipsis, mas o container manterá tamanho consistente → Aceitável como fallback
