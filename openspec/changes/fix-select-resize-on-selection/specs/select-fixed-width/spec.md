## ADDED Requirements

### Requirement: SelectField DEVE manter largura fixa independente do estado
O componente `SelectField` SHALL manter largura igual a 100% do container pai em todos os estados: sem seleção (placeholder visível), com item selecionado, e com texto longo truncado.

#### Scenario: Select com placeholder mantém largura total
- **WHEN** o SelectField é renderizado sem valor selecionado (exibindo placeholder)
- **THEN** o componente MUST ocupar 100% da largura do container pai

#### Scenario: Select com item selecionado mantém largura total
- **WHEN** o usuário seleciona um item no SelectField
- **THEN** o componente MUST manter a mesma largura que tinha antes da seleção (100% do container pai)

#### Scenario: Select dentro de HStack mantém largura proporcional
- **WHEN** o SelectField é renderizado dentro de um layout flex (como HStack no CategorySelector)
- **THEN** o componente MUST expandir para ocupar o espaço restante disponível (flex: 1), sem encolher ao selecionar um item

#### Scenario: Texto longo é truncado sem alterar largura
- **WHEN** o item selecionado possui texto mais longo que o espaço disponível
- **THEN** o texto MUST ser truncado com ellipsis e o componente MUST manter a largura fixa de 100%
