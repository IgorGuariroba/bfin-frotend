## ADDED Requirements

### Requirement: FormSelect renderiza select estilizado com padrão visual uniforme
O sistema SHALL renderizar um componente `FormSelect` que usa Chakra UI v3 `Select` com ícone à esquerda, `borderRadius="full"`, Portal para dropdown, e integração com react-hook-form via `Controller`.

#### Scenario: Renderização padrão do FormSelect
- **WHEN** o FormSelect é renderizado com label, placeholder, items e ícone
- **THEN** o select MUST exibir o ícone à esquerda, placeholder dentro do trigger, border radius arredondado, e dropdown via Portal com os items listados

#### Scenario: Seleção de item
- **WHEN** o usuário seleciona um item no dropdown
- **THEN** o valor selecionado MUST ser propagado para o react-hook-form via Controller e o trigger MUST exibir o label do item selecionado

### Requirement: FormSelect exibe erro de validação
O sistema SHALL exibir mensagem de erro abaixo do select quando o campo é inválido.

#### Scenario: Campo inválido com mensagem de erro
- **WHEN** o FormSelect recebe uma prop `error` com mensagem
- **THEN** o Field.Root MUST ter `invalid={true}` e a mensagem MUST ser exibida via `Field.ErrorText`

### Requirement: Frequência de Recorrência usa FormSelect
O select de "Frequência de Recorrência" no IncomeFormFields SHALL usar o componente `FormSelect` com ícone Zap, substituindo o `NativeSelect`.

#### Scenario: Select de recorrência com design uniforme
- **WHEN** o checkbox "Receita recorrente" está marcado
- **THEN** o select de frequência MUST ser renderizado usando FormSelect com as opções Mensal, Semanal e Anual, com o mesmo padrão visual do CategorySelector

### Requirement: CategorySelector usa FormSelect internamente
O CategorySelector SHALL delegar a renderização do select para o FormSelect, mantendo sua lógica específica (botão "+", validação de conta selecionada).

#### Scenario: CategorySelector renderizado com FormSelect
- **WHEN** o CategorySelector é renderizado
- **THEN** o select de categorias MUST usar FormSelect internamente e o botão "+" de nova categoria MUST continuar visível e funcional ao lado
