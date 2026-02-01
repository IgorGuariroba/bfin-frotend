<!--
SYNC IMPACT REPORT - Constitution Update v1.0.0
================================================================

VERSION CHANGE: Initial → v1.0.0
NEW PRINCIPLES:
1. Atomic Design → I. Atomic Design
2. TypeScript Strict → II. TypeScript Strict
3. State Management → III. State Management
4. Component-Driven → IV. Component-Driven
5. Form-First → V. Form-First
6. API-Driven → VI. API-Driven
7. Zero Secrets → VII. Zero Secrets
8. GitFlow Protegido → VIII. GitFlow Protegido
9. Test-Driven → IX. Test-Driven
10. Design System → X. Design System
11. Accessibility → XI. Accessibility
12. Developer Experience → XII. Developer Experience

NEW SECTIONS:
- Stack Obrigatório
- Chakra UI v3 Critical Rules
- Workflow & Quality

TEMPLATES REQUIRING UPDATES:
✅ plan-template.md - Constitution Check section aligns with 12 principles
✅ spec-template.md - Requirements structure supports new constraints
✅ tasks-template.md - Task categorization includes all principle-driven types
⚠ Agent commands - Generic guidance needed (no CLAUDE-specific references)

FOLLOW-UP TODOS: None - all placeholders filled with concrete values
================================================================
-->

# BFIN Frontend Constitution

## Core Principles

### I. Atomic Design
Componentes devem seguir hierarquia rigorosa: Atoms → Molecules → Organisms → Templates → Pages. NUNCA importar nível superior em inferior. Cada nível deve ter responsabilidade clara: Atoms (elementos básicos), Molecules (combinações simples), Organisms (lógica complexa).

**Rationale**: Garante escalabilidade da arquitetura de componentes e facilita manutenção através de dependências unidirecionais.

### II. TypeScript Strict
Zero uso de `any`. Validação obrigatória via Zod. Tipos do SDK devem ser utilizados sempre que disponíveis. Preferir `interface` para props, `type` para unions/intersections.

**Rationale**: Type safety previne bugs em runtime e melhora developer experience através de intellisense e refactoring seguro.

### III. State Management
React Query obrigatório para server state. Context apenas para estado de autenticação global. Hooks customizados para encapsular lógica de negócio. QueryClient invalidation após mutations.

**Rationale**: Separação clara entre client state, server state e side effects, reduzindo complexidade e bugs de sincronização.

### IV. Component-Driven
Storybook como fonte da verdade para componentes. Documentação automática obrigatória. Design tokens do Chakra UI v3 como única fonte de estilos. Cada componente deve ter story correspondente.

**Rationale**: Desenvolvimento isolado de componentes garante qualidade e reutilização, facilitando design system consistente.

### V. Form-First
React Hook Form + Zod obrigatório para TODOS os formulários. Validação client-side. Pattern Field.Root do Chakra UI v3. Nunca formulários sem schema de validação.

**Rationale**: Experiência consistente de formulários com validação robusta e performance otimizada.

### VI. API-Driven
SDK privado (@igorguariroba/bfin-sdk) como única fonte de API calls. Auto-atualização via GitHub Actions. Interceptors para autenticação. Type safety end-to-end através do SDK.

**Rationale**: Abstração consistente da API com tipos compartilhados entre frontend e backend, reduzindo divergências.

### VII. Zero Secrets
NUNCA commitar tokens, variáveis de ambiente ou credenciais. Setup automático do .npmrc. Security audit obrigatório no CI. Variáveis sensíveis apenas via environment.

**Rationale**: Prevenção de vazamentos de credenciais e conformidade com práticas de segurança.

### VIII. GitFlow Protegido
Branch `main` protegida - NUNCA push direto. Features branches obrigatórias. CI/CD deve passar antes de merge. Deploy automático após CI verde na main.

**Rationale**: Qualidade de código garantida através de code review e automated testing antes da produção.

### IX. Test-Driven
Vitest para testes unitários. Playwright para E2E. Coverage tracking obrigatório. Validação local antes de push: type-check + lint + test + build.

**Rationale**: Qualidade e confiabilidade através de testes automatizados em múltiplas camadas.

### X. Design System
Chakra UI v3 único sistema de design. Pattern Root/Content/Item. Tema orange como paleta principal. Mobile-first responsive design.

**Rationale**: Consistência visual e UX através de componentes padronizados e sistema de tokens.

### XI. Accessibility
HTML semântico obrigatório. ARIA compliance. Code splitting e lazy loading para performance. Suporte a screen readers.

**Rationale**: Inclusão e conformidade com padrões web, garantindo acesso universal ao sistema.

### XII. Developer Experience
Vite para hot reload. TypeScript strict mode. ESLint zero warnings. Conventional commits. Documentação automática via Storybook.

**Rationale**: Produtividade maximizada através de ferramentas otimizadas e feedback loops rápidos.

## Stack Obrigatório

**Core**: React 18 + TypeScript 5.3 | **UI**: Chakra UI v3 | **State**: React Query | **Forms**: React Hook Form + Zod | **API**: SDK Privado (@igorguariroba/bfin-sdk) | **Testing**: Vitest + Playwright | **Build**: Vite

**Rationale**: Stack testado e otimizado para o domínio financeiro com type safety end-to-end.

## Chakra UI v3 Critical Rules

### Component Patterns OBRIGATÓRIOS
```tsx
// ✅ V3: Root/Content/Item pattern
<Dialog.Root open={isOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Título</Dialog.Title>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

// ❌ V2: Props incorretas
<Modal isOpen={isOpen}> // deve ser 'open'
```

### Props Renaming OBRIGATÓRIO
- `isOpen` → `open`
- `isDisabled` → `disabled`
- `isInvalid` → `invalid`
- `colorScheme` → `colorPalette`
- `useToast()` → `toaster.create()`

**Rationale**: Chakra UI v3 quebrou compatibilidade com v2. Uso incorreto causa runtime errors e inconsistência visual.

## Workflow & Quality

### Nomenclatura OBRIGATÓRIA
- Componentes: `PascalCase.tsx`
- Hooks: `useCustomHook.ts`
- Services/Types: `camelCase.ts`

### Validações Locais OBRIGATÓRIAS
```bash
npm run type-check && npm run lint && npm test -- --run && npm run build
```

### Git Workflow OBRIGATÓRIO
```bash
git checkout main && git pull origin main
git checkout -b feature/nome
# desenvolver
# validações locais
git push origin feature/nome
# abrir PR - NUNCA push direto main
```

**Rationale**: Qualidade garantida através de validações automatizadas e code review obrigatório.

## Governance

Esta constituição supersede todas as outras práticas de desenvolvimento. Amendments requerem documentação completa, aprovação via PR e plano de migração.

Todos os PRs devem verificar compliance com estes princípios. Complexidade adicional deve ser explicitamente justificada com alternativas mais simples documentadas como rejeitadas.

Violações devem ser documentadas na seção "Complexity Tracking" do plan.md com justificativa técnica clara.

**Version**: 1.0.0 | **Ratified**: 2026-01-31 | **Last Amended**: 2026-01-31