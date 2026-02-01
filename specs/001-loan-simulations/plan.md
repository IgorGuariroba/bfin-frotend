# Implementation Plan: Sistema de Simulação de Empréstimos

**Branch**: `001-loan-simulations` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-loan-simulations/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Sistema completo de simulação de empréstimos usando a reserva de emergência como garantia. Permite aos usuários criar simulações informando valor, prazo e taxa de juros, visualizar cronograma de reposição, aprovar simulações (limitado a 70% da reserva) e executar saques transferindo fundos para o saldo disponível. Interface construída com Chakra UI v3 mantendo consistência com o design system existente, integração com @igorguariroba/bfin-sdk e ciclo completo de gestão de simulações (criar, listar, aprovar, sacar).

## Technical Context

**Language/Version**: TypeScript 5.3.3 + React 18.2.0
**Primary Dependencies**: Chakra UI v3.30.0, React Query 5.17.9, React Hook Form 7.49.3, Zod 3.22.4, @igorguariroba/bfin-sdk 0.12.0
**Storage**: API via SDK privado (backend PostgreSQL)
**Testing**: Vitest 4.0.16 (unit) + Playwright 1.57.0 (E2E)
**Target Platform**: Web browsers (desktop/mobile), PWA-ready
**Project Type**: Web application (frontend React SPA)
**Performance Goals**: <2s para cálculos de simulação, <3min para criar simulação completa, 95% precisão nos cálculos
**Constraints**: Chakra UI v3 syntax obrigatório, 70% limite da reserva, 30 dias expiração simulações, mobile-first responsivo
**Scale/Scope**: Múltiplas simulações por usuário, filtros e ordenação, cronogramas detalhados, integração completa com SDK

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Atomic Design ✅
- **Compliance**: Formulários → organisms/forms/, Listagem → organisms/lists/, Cards → molecules/, Inputs → atoms/
- **Validation**: Hierarquia respeitada, sem imports superiores em inferiores

### II. TypeScript Strict ✅
- **Compliance**: Tipos do SDK (@igorguariroba/bfin-sdk), interface para props, Zod para validação
- **Validation**: Zero `any`, tipos completos para simulações

### III. State Management ✅
- **Compliance**: React Query para API calls, hooks customizados (useLoanSimulations), invalidation após mutations
- **Validation**: Server state separado de client state

### IV. Component-Driven ✅
- **Compliance**: Storybook stories para todos componentes novos, design tokens Chakra UI v3
- **Validation**: Componentes isolados e documentados

### V. Form-First ✅
- **Compliance**: React Hook Form + Zod obrigatório, Field.Root pattern Chakra UI v3
- **Validation**: Schema validation para criação de simulações

### VI. API-Driven ✅
- **Compliance**: SDK privado único ponto de integração, endpoints LoanSimulations existentes
- **Validation**: Type safety end-to-end através do SDK

### VII. Zero Secrets ✅
- **Compliance**: Sem secrets no código, variáveis environment apenas
- **Validation**: Projeto já configurado com npmrc setup

### VIII. GitFlow Protegido ✅
- **Compliance**: Branch feature 001-loan-simulations, PR obrigatório para main
- **Validation**: CI deve passar antes de merge

### IX. Test-Driven ✅
- **Compliance**: Vitest unit tests, Playwright E2E, validações locais
- **Validation**: Coverage tracking para novos componentes

### X. Design System ✅
- **Compliance**: Chakra UI v3 Root/Content/Item pattern, tema orange existente
- **Validation**: Consistência visual garantida

### XI. Accessibility ✅
- **Compliance**: HTML semântico, ARIA labels, responsive design
- **Validation**: Suporte screen readers

### XII. Developer Experience ✅
- **Compliance**: Vite hot reload, TypeScript strict, ESLint zero warnings
- **Validation**: Ferramental já configurado

**GATE STATUS**: ✅ PASSED - Todos os princípios atendidos sem violações

### Constitution Re-Check Post-Design

**Re-validation Date**: 2026-02-01 after Phase 1 completion

#### Design Artifacts Validation
- ✅ **Data Model**: Entidades claramente definidas, validações de negócio documentadas
- ✅ **API Contracts**: OpenAPI spec completa, tipos TypeScript gerados, error handling
- ✅ **Component Structure**: Atomic Design rigorosamente seguido, hierarquia respeitada
- ✅ **Form Validation**: Schemas Zod completos, React Hook Form integration
- ✅ **State Management**: React Query patterns, hooks customizados, cache strategy
- ✅ **Testing Strategy**: Unit + E2E coverage, Storybook documentation
- ✅ **SDK Integration**: Tipos do SDK utilizados, service layer appropriado
- ✅ **Accessibility**: ARIA compliance planejado, semantic HTML, responsive design
- ✅ **Performance**: Query optimization, optimistic updates, lazy loading

**FINAL GATE STATUS**: ✅ PASSED - Design completo alinhado com constituição

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── atoms/
│   │   └── (componentes básicos reutilizáveis)
│   ├── molecules/
│   │   ├── LoanSimulationCard/        # Card de simulação na listagem
│   │   ├── SimulationSummary/         # Resumo da simulação
│   │   └── InstallmentRow/            # Linha do cronograma
│   ├── organisms/
│   │   ├── forms/
│   │   │   ├── LoanSimulationForm/    # Formulário criação simulação
│   │   │   └── ApprovalForm/          # Formulário aprovação
│   │   ├── lists/
│   │   │   └── LoanSimulationList/    # Lista de simulações
│   │   └── dialogs/
│   │       ├── SimulationDetailsDialog/ # Modal detalhes
│   │       └── WithdrawConfirmDialog/   # Confirmação saque
│   └── ui/
│       └── (componentes Chakra UI customizados)
├── hooks/
│   ├── useLoanSimulations.ts          # Hook para gestão de simulações
│   ├── useLoanSimulationDetails.ts    # Hook para detalhes
│   └── useEmergencyReserve.ts         # Hook para dados da reserva
├── pages/
│   ├── LoanSimulations/               # Página principal
│   └── LoanSimulationDetails/         # Página de detalhes
├── services/
│   └── loanSimulationService.ts       # Service layer SDK
├── types/
│   └── loanSimulation.ts              # Types específicos
└── stories/
    └── (Storybook stories para componentes)

tests/
├── components/                        # Testes unitários Vitest
├── hooks/                            # Testes de hooks
├── e2e/                              # Testes E2E Playwright
└── fixtures/                         # Dados de teste
```

**Structure Decision**: Web application frontend seguindo Atomic Design rigoroso. Componentes organizados por complexidade (atoms → molecules → organisms), hooks customizados para lógica de negócio, service layer para abstrair SDK, types específicos para domain modeling, e cobertura completa de testes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
