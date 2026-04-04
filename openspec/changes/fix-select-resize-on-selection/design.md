## Context

O componente `SelectField` (`src/components/molecules/SelectField.tsx`) é o select reutilizável do projeto, usado em formulários como `IncomeFormFields`, `ExpenseFormFields`, etc. Atualmente, ao selecionar um item, o select encolhe para o tamanho do texto selecionado ao invés de manter a largura total do container.

A causa raiz é que o `Field.Root` (container mais externo) não possui `width="full"`, fazendo com que o layout seja determinado pelo conteúdo interno. Embora `Select.Trigger` e `Select.Control` tenham `width="full"`, isso é relativo ao `Field.Root` que está com largura baseada em conteúdo.

Além disso, no `CategorySelector`, o `SelectField` está dentro de um `HStack` sem `flex={1}`, permitindo que encolha.

## Goals / Non-Goals

**Goals:**
- Garantir que `SelectField` mantenha largura 100% do container em todos os estados (vazio, com placeholder, com valor selecionado)
- Corrigir o layout do `CategorySelector` para que o select ocupe o espaço restante no `HStack`

**Non-Goals:**
- Alterar o visual/estilo dos selects além da largura
- Refatorar a estrutura interna do `Select.Root` do Chakra UI v3
- Modificar outros componentes de formulário que não sejam afetados

## Decisions

**Decisão 1: Adicionar `width="full"` ao `Field.Root` no `SelectField`**
- Rationale: O `Field.Root` é o container mais externo do componente. Sem largura definida, ele colapsa para o tamanho do conteúdo. Definir `width="full"` garante que ele ocupe todo o espaço disponível do parent.
- Alternativa considerada: Usar `minWidth="100%"` — descartada pois `width="full"` é o padrão Chakra e mais semântico.

**Decisão 2: Adicionar `flex={1}` ao `SelectField` wrapper no `CategorySelector`**
- Rationale: Dentro de um `HStack`, elementos sem `flex` podem encolher. Adicionando `flex={1}` ao `Field.Root` do `SelectField` (ou wrapping com Box), o select ocupará todo o espaço restante após o botão.
- Alternativa considerada: Envolver em um `Box flex={1}` no `CategorySelector` — possível, mas melhor resolver direto no `SelectField` com `width="full"` que resolve ambos os cenários.

## Risks / Trade-offs

- [Baixo risco] A mudança afeta todos os usos de `SelectField` globalmente → Isso é desejável, pois o comportamento correto é sempre ocupar 100% da largura.
- [Baixo risco] Possível overflow de texto longo → Já tratado com `overflow="hidden"` e `textOverflow="ellipsis"` no `Select.ValueText`.
