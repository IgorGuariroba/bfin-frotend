# Tasks: Sistema de Simulação de Empréstimos

**Input**: Design documents from `/specs/001-loan-simulations/`
**Prerequisites**: plan.md (completed), spec.md (completed), research.md, data-model.md, contracts/

**Tests**: Tests incluídos conforme constituição Test-Driven (Vitest unit tests + Playwright E2E)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `src/` at repository root
- All paths assume frontend React SPA structure from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuração inicial e estrutura base do projeto

- [x] T001 Verificar branch `001-loan-simulations` está ativa e atualizada com main
- [x] T002 Validar SDK atualizado `@igorguariroba/bfin-sdk@0.12.0` e dependências
- [x] T003 [P] Executar validações locais (type-check, lint, test, build) para baseline

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base técnica que DEVE estar completa antes de qualquer user story poder ser implementada

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Criar tipos base em src/types/loanSimulation.ts (interfaces, enums, constantes)
- [ ] T005 [P] Implementar schemas Zod de validação em src/types/loanSimulation.ts
- [ ] T006 [P] Criar service layer em src/services/loanSimulationService.ts usando SDK
- [ ] T007 Setup de teste fixtures em tests/fixtures/loanSimulation.ts
- [ ] T008 [P] Configurar mocks do SDK para testes em tests/__mocks__/@igorguariroba/bfin-sdk.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Criar Nova Simulação de Empréstimo (Priority: P1) 🎯 MVP

**Goal**: Usuário pode criar simulação informando valor, prazo e taxa de juros com cálculo automático e validação de limites

**Independent Test**: Criar simulação válida, verificar cálculos corretos e persistência no sistema

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Test unitário para LoanSimulationForm em tests/components/organisms/forms/LoanSimulationForm.test.tsx
- [ ] T010 [P] [US1] Test E2E para criar simulação em tests/e2e/loan-simulations/create-simulation.e2e.ts
- [ ] T011 [P] [US1] Test de hook useLoanSimulations em tests/hooks/useLoanSimulations.test.ts

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implementar CurrencyInput atom em src/components/atoms/CurrencyInput/
- [ ] T013 [P] [US1] Implementar StatusBadge atom em src/components/atoms/StatusBadge/
- [ ] T014 [P] [US1] Criar hook useEmergencyReserve em src/hooks/useEmergencyReserve.ts
- [ ] T015 [US1] Implementar LoanSimulationForm organism em src/components/organisms/forms/LoanSimulationForm/
- [ ] T016 [US1] Criar hook useLoanSimulations em src/hooks/useLoanSimulations.ts (depends on T014, T015)
- [ ] T017 [US1] Implementar página LoanSimulations em src/pages/LoanSimulations/
- [ ] T018 [US1] Adicionar rota para página LoanSimulations no router principal
- [ ] T019 [P] [US1] Criar Storybook stories para LoanSimulationForm em src/stories/loan-simulations/LoanSimulationForm.stories.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Listar e Visualizar Simulações Existentes (Priority: P1)

**Goal**: Usuário visualiza lista completa de simulações com filtros por status, ordenação e informações resumidas

**Independent Test**: Criar simulações e verificar listagem com filtros funcionando corretamente

### Tests for User Story 2

- [ ] T020 [P] [US2] Test unitário para LoanSimulationList em tests/components/organisms/lists/LoanSimulationList.test.tsx
- [ ] T021 [P] [US2] Test unitário para LoanSimulationCard em tests/components/molecules/LoanSimulationCard.test.tsx
- [ ] T022 [P] [US2] Test E2E para listar e filtrar simulações em tests/e2e/loan-simulations/list-simulations.e2e.ts

### Implementation for User Story 2

- [ ] T023 [P] [US2] Implementar LoanSimulationCard molecule em src/components/molecules/LoanSimulationCard/
- [ ] T024 [P] [US2] Implementar SimulationSummary molecule em src/components/molecules/SimulationSummary/
- [ ] T025 [US2] Implementar LoanSimulationList organism em src/components/organisms/lists/LoanSimulationList/
- [ ] T026 [US2] Adicionar filtros e ordenação à página LoanSimulations (integração com T017)
- [ ] T027 [US2] Implementar empty states para lista vazia
- [ ] T028 [P] [US2] Criar Storybook stories para LoanSimulationCard em src/stories/loan-simulations/LoanSimulationCard.stories.tsx
- [ ] T029 [P] [US2] Criar Storybook stories para LoanSimulationList em src/stories/loan-simulations/LoanSimulationList.stories.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Visualizar Detalhes Completos da Simulação (Priority: P2)

**Goal**: Usuário acessa detalhes completos de simulação incluindo cronograma de reposição e histórico de status

**Independent Test**: Acessar detalhes de simulação e verificar informações completas exibidas

### Tests for User Story 3

- [ ] T030 [P] [US3] Test unitário para SimulationDetailsDialog em tests/components/organisms/dialogs/SimulationDetailsDialog.test.tsx
- [ ] T031 [P] [US3] Test unitário para InstallmentRow em tests/components/molecules/InstallmentRow.test.tsx
- [ ] T032 [P] [US3] Test de hook useLoanSimulationDetails em tests/hooks/useLoanSimulationDetails.test.ts
- [ ] T033 [P] [US3] Test E2E para visualizar detalhes em tests/e2e/loan-simulations/view-details.e2e.ts

### Implementation for User Story 3

- [ ] T034 [P] [US3] Implementar InstallmentRow molecule em src/components/molecules/InstallmentRow/
- [ ] T035 [US3] Criar hook useLoanSimulationDetails em src/hooks/useLoanSimulationDetails.ts
- [ ] T036 [US3] Implementar SimulationDetailsDialog organism em src/components/organisms/dialogs/SimulationDetailsDialog/
- [ ] T037 [US3] Implementar página LoanSimulationDetails em src/pages/LoanSimulationDetails/
- [ ] T038 [US3] Adicionar rota para página detalhes e navegação entre lista e detalhes
- [ ] T039 [US3] Implementar tabela responsiva do cronograma de reposição
- [ ] T040 [P] [US3] Criar Storybook stories para InstallmentRow em src/stories/loan-simulations/InstallmentRow.stories.tsx
- [ ] T041 [P] [US3] Criar Storybook stories para SimulationDetailsDialog em src/stories/loan-simulations/SimulationDetailsDialog.stories.tsx

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Aprovar Simulação e Converter em Empréstimo (Priority: P2)

**Goal**: Usuário pode aprovar simulação válida (dentro de 30 dias) mudando status e preparando transferência

**Independent Test**: Aprovar simulação pendente e verificar mudança de status e próximos passos

### Tests for User Story 4

- [ ] T042 [P] [US4] Test unitário para ações de aprovação no LoanSimulationCard
- [ ] T043 [P] [US4] Test de validações de expiração (30 dias) em hook useLoanSimulationDetails
- [ ] T044 [P] [US4] Test E2E para aprovar simulação em tests/e2e/loan-simulations/approve-simulation.e2e.ts

### Implementation for User Story 4

- [ ] T045 [US4] Adicionar ação de aprovação ao useLoanSimulationDetails hook (mutation)
- [ ] T046 [US4] Implementar validações de expiração de 30 dias na interface
- [ ] T047 [US4] Adicionar botões de ação contextuais no SimulationDetailsDialog
- [ ] T048 [US4] Implementar notificações de aprovação usando toaster Chakra UI v3
- [ ] T049 [US4] Adicionar indicadores visuais de prazo restante nos cards de simulação
- [ ] T050 [US4] Implementar estados de loading durante aprovação

**Checkpoint**: User Stories 1-4 should all work independently with complete approval flow

---

## Phase 7: User Story 5 - Sacar Valor do Empréstimo Aprovado (Priority: P3)

**Goal**: Usuário pode solicitar saque de empréstimo aprovado transferindo valor da reserva para saldo disponível

**Independent Test**: Solicitar saque de simulação aprovada e verificar conclusão e transferência

### Tests for User Story 5

- [ ] T051 [P] [US5] Test unitário para WithdrawConfirmDialog em tests/components/organisms/dialogs/WithdrawConfirmDialog.test.tsx
- [ ] T052 [P] [US5] Test de validações de saque em hook useLoanSimulationDetails
- [ ] T053 [P] [US5] Test E2E para sacar empréstimo em tests/e2e/loan-simulations/withdraw-loan.e2e.ts

### Implementation for User Story 5

- [ ] T054 [P] [US5] Implementar WithdrawConfirmDialog organism em src/components/organisms/dialogs/WithdrawConfirmDialog/
- [ ] T055 [US5] Adicionar ação de saque ao useLoanSimulationDetails hook (mutation)
- [ ] T056 [US5] Integrar ação de saque no fluxo de detalhes da simulação
- [ ] T057 [US5] Implementar confirmação de segurança para saque
- [ ] T058 [US5] Adicionar validações de saldo e limite disponível na reserva
- [ ] T059 [US5] Implementar feedback visual para conclusão do saque
- [ ] T060 [P] [US5] Criar Storybook stories para WithdrawConfirmDialog em src/stories/loan-simulations/WithdrawConfirmDialog.stories.tsx

**Checkpoint**: All user stories should now be independently functional with complete loan cycle

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories e finalização

- [ ] T061 [P] Implementar testes de acessibilidade usando jest-axe em tests/accessibility/
- [ ] T062 [P] Otimizar performance com React.memo nos componentes principais
- [ ] T063 [P] Adicionar loading skeletons para melhor UX durante carregamento
- [ ] T064 [P] Implementar error boundaries para componentes de simulação
- [ ] T065 [P] Validar responsividade mobile em todos os componentes
- [ ] T066 [P] Executar validações finais do quickstart.md
- [ ] T067 Code cleanup e refatoração para padrões consistentes
- [ ] T068 Documentação final no README da feature
- [ ] T069 Validar coverage de testes atinge meta de 90%
- [ ] T070 Executar validações completas da constituição (Constitution Check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2 → P2 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Uses components from US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Integrates with US3 details view but independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Uses US4 approval flow but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Atoms before molecules before organisms
- Hooks before components that use them
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- All Storybook stories marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Test unitário para LoanSimulationForm em tests/components/organisms/forms/LoanSimulationForm.test.tsx"
Task: "Test E2E para criar simulação em tests/e2e/loan-simulations/create-simulation.e2e.ts"
Task: "Test de hook useLoanSimulations em tests/hooks/useLoanSimulations.test.ts"

# Launch all atoms for User Story 1 together:
Task: "Implementar CurrencyInput atom em src/components/atoms/CurrencyInput/"
Task: "Implementar StatusBadge atom em src/components/atoms/StatusBadge/"

# Launch Storybook stories in parallel:
Task: "Criar Storybook stories para LoanSimulationForm"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create Simulations)
4. Complete Phase 4: User Story 2 (List & View Simulations)
5. **STOP and VALIDATE**: Test US1 + US2 independently
6. Deploy/demo basic simulation creation and listing

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Basic MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Complete viewing)
4. Add User Story 3 → Test independently → Deploy/Demo (Detailed views)
5. Add User Story 4 → Test independently → Deploy/Demo (Approval flow)
6. Add User Story 5 → Test independently → Deploy/Demo (Complete cycle)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Create simulations)
   - Developer B: User Story 2 (List simulations)
   - Developer C: User Story 3 (View details)
3. Continue with US4 and US5 based on priority and capacity
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (Test-Driven Development)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow Chakra UI v3 patterns rigorosamente
- All components must have Storybook stories
- Accessibility compliance obrigatório (ARIA, semantic HTML)
- Responsividade mobile-first
- TypeScript strict mode (zero `any`)
- Constitution compliance em todos os pontos