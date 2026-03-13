# Feature Specification: Sistema de Simulação de Empréstimos

**Feature Branch**: `001-loan-simulations`
**Created**: 2026-02-01
**Status**: Draft
**Input**: User description: "quero consulmir as rotas do LoanSimulations do pacote @igorguariroba/bfin-sdk no form do emprestimos para eu conseguir criar,listar,obter detalhe, aprovar e retirar."

## Clarifications

### Session 2026-02-01

- Q: De onde vem a taxa de juros mensal (interestRateMonthly) para o cálculo da simulação? → A: Usuário informa taxa desejada, sistema valida limites
- Q: Como deve ser tratado o limite de 70% da reserva de emergência na interface? → A: Mostrar limite disponível, bloquear criação se exceder 70%
- Q: Qual terminologia deve ser usada na interface para os status das simulações? → A: API: Pendente, Aprovado, Concluído
- Q: Como deve ser tratada a expiração de 30 dias das simulações na interface? → A: Mostrar prazo restante, bloquear aprovação após expirar
- Q: Como deve ser apresentado o cronograma de parcelas na interface? → A: "Cronograma de reposição da reserva de emergência"

## User Scenarios & Testing *(mandatory)*


### User Story 1 - Criar Nova Simulação de Empréstimo (Priority: P1)

O usuário acessa a tela de empréstimos e cria uma nova simulação informando valor desejado (limitado a 70% da reserva de emergência), prazo em meses e taxa de juros. O sistema calcula automaticamente as parcelas e valor total a ser pago, gerando uma proposta que pode ser salva para análise posterior.

**Why this priority**: Esta é a funcionalidade core do sistema de empréstimos. Sem a capacidade de criar simulações, não há valor para o usuário. É o ponto de entrada fundamental para todo o fluxo de empréstimo.

**Independent Test**: Pode ser completamente testado criando uma simulação com valores válidos e verificando se os cálculos estão corretos e a simulação é persistida no sistema.

**Acceptance Scenarios**:

1. **Given** usuário está na tela de empréstimos, **When** preenche formulário com valor R$ 10.000, prazo 12 meses e garantia "sem garantia", **Then** sistema calcula parcelas e exibe simulação completa com valor total
2. **Given** formulário de simulação preenchido com dados válidos, **When** usuário clica em "Simular", **Then** nova simulação é criada e salva no sistema
3. **Given** usuário informa valor inválido (negativo ou zero), **When** tenta criar simulação, **Then** sistema exibe erro de validação específico

---

### User Story 2 - Listar e Visualizar Simulações Existentes (Priority: P1)

O usuário visualiza uma lista completa de todas suas simulações de empréstimo criadas, podendo filtrar por status (pendente, aprovado, concluído), ordenar por data e visualizar informações resumidas de cada simulação para acompanhamento do histórico.

**Why this priority**: É essencial para o usuário acompanhar suas solicitações e ter controle sobre o histórico de simulações. Faz parte do fluxo básico de gestão financeira.

**Independent Test**: Pode ser testado criando algumas simulações e verificando se aparecem corretamente na listagem com filtros e ordenação funcionando.

**Acceptance Scenarios**:

1. **Given** usuário possui simulações criadas, **When** acessa tela de empréstimos, **Then** vê lista completa de simulações ordenadas por data mais recente
2. **Given** lista de simulações carregada, **When** aplica filtro por status "aprovado", **Then** mostra apenas simulações aprovadas
3. **Given** usuário sem simulações, **When** acessa tela, **Then** vê mensagem explicativa e botão para criar primeira simulação

---

### User Story 3 - Visualizar Detalhes Completos da Simulação (Priority: P2)

O usuário clica em uma simulação específica e acessa uma tela detalhada mostrando todas as informações: valores, prazos, parcelas calculadas, histórico de status, documentos anexados e próximos passos disponíveis (aprovar, editar, excluir).

**Why this priority**: Permite ao usuário tomar decisões informadas sobre cada simulação. É importante para transparência e confiança no processo.

**Independent Test**: Pode ser testado acessando detalhes de uma simulação e verificando se todas as informações são exibidas corretamente.

**Acceptance Scenarios**:

1. **Given** simulação existe no sistema, **When** usuário clica para ver detalhes, **Then** carrega tela com todas informações da simulação
2. **Given** tela de detalhes carregada, **When** usuário visualiza cronograma de reposição da reserva, **Then** vê tabela detalhada com cada parcela, data de vencimento e valor
3. **Given** simulação com documentos anexados, **When** acessa detalhes, **Then** lista de documentos é exibida com opção de download

---

### User Story 4 - Aprovar Simulação e Converter em Empréstimo (Priority: P2)

O usuário revisa uma simulação criada (dentro do prazo de 30 dias) e decide aprová-la, iniciando o processo formal de empréstimo da reserva. O sistema atualiza o status e prepara a transferência de fundos.

**Why this priority**: Converte a simulação em ação real. É o passo que gera valor financeiro efetivo para o usuário.

**Independent Test**: Pode ser testado aprovando uma simulação e verificando se o status muda corretamente e próximos passos são apresentados.

**Acceptance Scenarios**:

1. **Given** simulação em status pendente, **When** usuário clica em "Aprovar", **Then** status muda para "aprovado" e notificação é enviada
2. **Given** simulação aprovada, **When** usuário acessa detalhes, **Then** vê próximos passos do processo de contratação
3. **Given** simulação já aprovada, **When** usuário tenta aprovar novamente, **Then** sistema impede ação e mostra status atual

---

### User Story 5 - Sacar Valor do Empréstimo Aprovado (Priority: P3)

O usuário com empréstimo aprovado pode solicitar o saque do valor da reserva de emergência. O sistema processa a solicitação e atualiza o status para "concluído", transferindo o valor para o saldo disponível.

**Why this priority**: É o passo final do processo, mas depende de aprovações e validações externas. Importante para completude do fluxo, mas não crítico para MVP.

**Independent Test**: Pode ser testado com simulação aprovada solicitando saque e verificando atualização de status e início do cronograma.

**Acceptance Scenarios**:

1. **Given** empréstimo aprovado, **When** usuário solicita saque da reserva, **Then** status muda para "concluído" e valor é transferido para saldo disponível
2. **Given** saque processado com sucesso, **When** usuário acessa detalhes, **Then** vê histórico completo da simulação e impacto no saldo
3. **Given** empréstimo concluído, **When** usuário tenta nova ação na simulação, **Then** sistema mostra apenas opções de visualização

### Edge Cases

- O que acontece quando API de cálculo de juros está indisponível durante simulação?
- Como sistema lida com simulações criadas com taxas antigas quando taxas mudam?
- O que acontece se usuário tenta aprovar simulação que já expirou os 30 dias?
- Como sistema processa solicitação de saque quando conta bancária informada é inválida?
- O que acontece quando usuário possui múltiplas simulações aprovadas simultaneamente?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST permitir criação de simulação informando valor desejado (R$ 500 a R$ 100.000), prazo em meses (6 a 60 meses) e tipo de garantia
- **FR-002**: Sistema MUST calcular automaticamente parcelas e valor total baseado na taxa de juros mensal informada pelo usuário (com validação de limites mínimo/máximo)
- **FR-003**: Sistema MUST salvar simulação criada com status inicial "pendente"
- **FR-004**: Sistema MUST listar todas simulações do usuário com filtros por status e ordenação por data
- **FR-005**: Sistema MUST exibir detalhes completos de simulação incluindo cronograma de reposição da reserva calculado
- **FR-006**: Usuários MUST poder aprovar simulação válida, mudando status para "aprovado"
- **FR-007**: Sistema MUST permitir solicitação de saque para empréstimos aprovados informando dados bancários
- **FR-008**: Sistema MUST validar dados de entrada (valores numéricos positivos, prazos dentro dos limites)
- **FR-009**: Sistema MUST manter histórico de mudanças de status das simulações
- **FR-010**: Sistema MUST impedir ações inválidas baseadas no status atual (ex: aprovar simulação já concluída)
- **FR-011**: Sistema MUST validar se a taxa de juros mensal informada pelo usuário está dentro dos limites permitidos (mínimo/máximo)
- **FR-012**: Sistema MUST exibir o limite disponível de empréstimo baseado em 70% da reserva de emergência e impedir criação de simulações que excedam esse limite
- **FR-013**: Sistema MUST exibir prazo restante (30 dias) para aprovação de simulações pendentes e impedir aprovação de simulações expiradas

### Key Entities

- **Simulação de Empréstimo**: Representa uma proposta de empréstimo com valor, prazo, tipo de garantia, parcelas calculadas, status atual e histórico de mudanças
- **Cronograma de Reposição**: Lista detalhada de parcelas para reposição da reserva de emergência, com datas de vencimento, valores e status de cada parcela
- **Dados Bancários**: Informações de conta bancária para depósito do valor sacado (banco, agência, conta, tipo de conta)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários conseguem criar simulação de empréstimo completa em menos de 3 minutos
- **SC-002**: Sistema calcula e exibe resultados da simulação em menos de 2 segundos
- **SC-003**: 95% das simulações criadas possuem cálculos precisos de juros e parcelas
- **SC-004**: Interface permite gestão completa do ciclo de vida da simulação (criar, listar, aprovar, sacar) sem necessidade de suporte
- **SC-005**: Sistema processa aprovações e saques sem perda de dados em 99% dos casos
