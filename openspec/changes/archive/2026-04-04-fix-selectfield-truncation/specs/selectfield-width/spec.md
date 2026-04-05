## ADDED Requirements

### Requirement: SelectField mantém largura consistente em todos os estados
O componente `SelectField` SHALL manter largura `100%` do container pai independente do estado (sem valor, com placeholder, com valor selecionado).

#### Scenario: Largura permanece estável após seleção
- **WHEN** o usuário seleciona um item no SelectField
- **THEN** a largura do trigger NÃO DEVE mudar em relação ao estado com placeholder

#### Scenario: Texto do valor selecionado é exibido por completo
- **WHEN** o usuário seleciona um item com texto de tamanho normal (ex: "Salário", "Alimentação")
- **THEN** o texto DEVE ser exibido por completo sem truncamento

#### Scenario: Texto extremamente longo usa ellipsis como fallback
- **WHEN** o usuário seleciona um item com texto muito longo que excede a largura do container
- **THEN** o texto DEVE usar ellipsis (...) mas o container NÃO DEVE mudar de tamanho
