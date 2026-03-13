# Quickstart Guide: Sistema de Simulação de Empréstimos

**Feature**: 001-loan-simulations
**Date**: 2026-02-01
**Target**: Desenvolvedores implementando a feature

## 🚀 Setup Inicial

### Pré-requisitos
- Branch `001-loan-simulations` ativa
- SDK atualizado (`@igorguariroba/bfin-sdk@0.12.0`)
- Dependências instaladas: `npm install`

### Validação do Ambiente
```bash
# Confirmar branch
git branch

# Validar SDK
npm list @igorguariroba/bfin-sdk

# Validar stack base
npm run type-check
npm run lint
npm test -- --run
npm run build
```

## 📁 Estrutura de Implementação

### Ordem de Desenvolvimento (seguir rigorosamente)

1. **Types & Services** (base técnica)
2. **Atoms** (componentes básicos)
3. **Molecules** (componentes compostos)
4. **Organisms** (componentes complexos)
5. **Hooks** (lógica de negócio)
6. **Pages** (integração completa)
7. **Tests** (validação)

### Caminhos dos Arquivos

```typescript
// 1. Types & Services
src/types/loanSimulation.ts                    // ✅ Prioridade 1
src/services/loanSimulationService.ts          // ✅ Prioridade 1

// 2. Atoms (ordem de implementação)
src/components/atoms/CurrencyInput/            // ✅ Prioridade 2
src/components/atoms/StatusBadge/              // ✅ Prioridade 2

// 3. Molecules (ordem de implementação)
src/components/molecules/LoanSimulationCard/   // ✅ Prioridade 3
src/components/molecules/SimulationSummary/    // ✅ Prioridade 3
src/components/molecules/InstallmentRow/       // ✅ Prioridade 3

// 4. Organisms (ordem de implementação)
src/components/organisms/forms/LoanSimulationForm/      // ✅ Prioridade 4
src/components/organisms/lists/LoanSimulationList/      // ✅ Prioridade 4
src/components/organisms/dialogs/SimulationDetailsDialog/ // ✅ Prioridade 4
src/components/organisms/dialogs/WithdrawConfirmDialog/   // ✅ Prioridade 4

// 5. Hooks (ordem de implementação)
src/hooks/useLoanSimulations.ts                // ✅ Prioridade 5
src/hooks/useLoanSimulationDetails.ts          // ✅ Prioridade 5
src/hooks/useEmergencyReserve.ts               // ✅ Prioridade 5

// 6. Pages
src/pages/LoanSimulations/                     // ✅ Prioridade 6
src/pages/LoanSimulationDetails/               // ✅ Prioridade 6

// 7. Storybook
src/stories/loan-simulations/                  // ✅ Prioridade 7
```

## 🎯 Checklist de Implementação

### Phase 1: Base Técnica
- [ ] **Types**: Implementar `src/types/loanSimulation.ts`
  - [ ] Interfaces completas com JSDoc
  - [ ] Schemas Zod para validação
  - [ ] Constantes e enums
- [ ] **Service**: Implementar `src/services/loanSimulationService.ts`
  - [ ] Métodos CRUD usando SDK
  - [ ] Error handling tipado
  - [ ] TypeScript strict compliance

### Phase 2: Atomic Components
- [ ] **CurrencyInput**: Input para valores monetários
  - [ ] Máscara R$ automática
  - [ ] Validação numérica
  - [ ] Integração com React Hook Form
  - [ ] Story + testes
- [ ] **StatusBadge**: Badge para status das simulações
  - [ ] Cores por status (PENDING/APPROVED/COMPLETED)
  - [ ] Acessibilidade (ARIA)
  - [ ] Story + testes

### Phase 3: Molecular Components
- [ ] **LoanSimulationCard**: Card na listagem
  - [ ] Layout responsivo
  - [ ] Dados principais visíveis
  - [ ] Actions condicionais por status
  - [ ] Story + testes
- [ ] **SimulationSummary**: Resumo da simulação
  - [ ] Valores calculados
  - [ ] Cronograma resumido
  - [ ] Indicadores visuais
  - [ ] Story + testes
- [ ] **InstallmentRow**: Linha do cronograma
  - [ ] Formatação monetária
  - [ ] Layout mobile-friendly
  - [ ] Story + testes

### Phase 4: Organism Components
- [ ] **LoanSimulationForm**: Formulário principal
  - [ ] React Hook Form + Zod
  - [ ] Validação em tempo real
  - [ ] Cálculo automático de limites
  - [ ] Chakra UI v3 Field.Root pattern
  - [ ] Story + testes
- [ ] **LoanSimulationList**: Lista de simulações
  - [ ] Filtros por status
  - [ ] Ordenação por data
  - [ ] Paginação
  - [ ] Empty states
  - [ ] Story + testes
- [ ] **SimulationDetailsDialog**: Modal de detalhes
  - [ ] Chakra UI v3 Dialog.Root pattern
  - [ ] Cronograma completo
  - [ ] Actions contextuais
  - [ ] Story + testes
- [ ] **WithdrawConfirmDialog**: Confirmação de saque
  - [ ] Informações do saque
  - [ ] Validações de segurança
  - [ ] Story + testes

### Phase 5: Business Logic Hooks
- [ ] **useLoanSimulations**: Hook principal
  - [ ] React Query integration
  - [ ] Create, list, filter operations
  - [ ] Cache invalidation
  - [ ] Error handling
  - [ ] Testes
- [ ] **useLoanSimulationDetails**: Hook detalhes
  - [ ] Get, approve, withdraw operations
  - [ ] Optimistic updates
  - [ ] Status transitions
  - [ ] Testes
- [ ] **useEmergencyReserve**: Hook reserva
  - [ ] Dados da reserva
  - [ ] Cálculo de limites
  - [ ] Validações em tempo real
  - [ ] Testes

### Phase 6: Pages & Integration
- [ ] **LoanSimulations**: Página principal
  - [ ] Lista + filtros
  - [ ] FAB para criar nova simulação
  - [ ] Navigation para detalhes
  - [ ] Responsive design
  - [ ] E2E testes
- [ ] **LoanSimulationDetails**: Página detalhes
  - [ ] Informações completas
  - [ ] Actions principais
  - [ ] Breadcrumb navigation
  - [ ] E2E testes

### Phase 7: Documentation & Testing
- [ ] **Storybook Stories**: Documentação visual
  - [ ] Todos os componentes documentados
  - [ ] Casos de uso principais
  - [ ] Estados de loading/error
- [ ] **Tests**: Cobertura completa
  - [ ] Unit tests (Vitest)
  - [ ] Integration tests
  - [ ] E2E tests (Playwright)
  - [ ] Accessibility tests

## 🛠 Patterns Obrigatórios

### Chakra UI v3 Compliance
```tsx
// ✅ CORRETO: Dialog v3
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Título</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>Conteúdo</Dialog.Body>
  </Dialog.Content>
</Dialog.Root>

// ✅ CORRETO: Form v3
<Field.Root invalid={!!errors.amount}>
  <Field.Label>Valor</Field.Label>
  <Input {...register('amount')} />
  <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
</Field.Root>

// ❌ ERRADO: Sintaxe v2
<Modal isOpen={isOpen}> // deve ser Dialog.Root open={}
<FormControl isInvalid> // deve ser Field.Root invalid
```

### React Query Pattern
```tsx
// Hook customizado
export const useLoanSimulations = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['loan-simulations'],
    queryFn: loanSimulationService.list,
  })

  const createMutation = useMutation({
    mutationFn: loanSimulationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-simulations'] })
    },
  })

  return {
    simulations: data ?? [],
    isLoading,
    error,
    createSimulation: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}
```

### Form Validation Pattern
```tsx
const schema = z.object({
  amount: z.number().min(500).max(100000),
  termMonths: z.number().int().min(6).max(60),
  interestRateMonthly: z.number().min(0).max(10),
})

type FormData = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```typescript
// Exemplo: LoanSimulationCard.test.tsx
import { render, screen } from '@testing-library/react'
import { LoanSimulationCard } from './LoanSimulationCard'

describe('LoanSimulationCard', () => {
  it('should display simulation amount', () => {
    const simulation = createMockSimulation({ amount: 10000 })
    render(<LoanSimulationCard simulation={simulation} />)
    expect(screen.getByText('R$ 10.000,00')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)
```typescript
// Exemplo: loan-simulations.e2e.ts
test('should create loan simulation', async ({ page }) => {
  await page.goto('/loan-simulations')
  await page.click('text=Nova Simulação')
  await page.fill('[data-testid=amount-input]', '10000')
  await page.fill('[data-testid=term-input]', '12')
  await page.fill('[data-testid=rate-input]', '2.5')
  await page.click('text=Simular')
  await expect(page.locator('text=Simulação criada')).toBeVisible()
})
```

## 🔄 Development Workflow

### Daily Workflow
```bash
# 1. Sincronizar com main
git checkout main && git pull origin main
git checkout 001-loan-simulations && git merge main

# 2. Desenvolver feature
# ... código ...

# 3. Validar localmente (OBRIGATÓRIO)
npm run type-check
npm run lint
npm test -- --run
npm run build

# 4. Commit & push
git add .
git commit -m "feat: implement LoanSimulationCard component"
git push origin 001-loan-simulations
```

### Storybook Development
```bash
# Desenvolver componentes isoladamente
npm run dev:storybook

# Acessar: http://localhost:6006
```

### Testing During Development
```bash
# Tests em watch mode
npm test

# E2E specific
npm run test:e2e -- loan-simulations

# Coverage
npm run test:coverage
```

## 📋 Code Review Checklist

### Before PR
- [ ] Todos os arquivos implementados seguindo estrutura
- [ ] Chakra UI v3 patterns corretos
- [ ] TypeScript strict (zero `any`)
- [ ] React Query patterns consistentes
- [ ] Testes unitários passando
- [ ] E2E tests passando
- [ ] Storybook stories criadas
- [ ] Acessibilidade validada
- [ ] Mobile responsive
- [ ] Performance otimizada

### Constitution Compliance
- [ ] ✅ Atomic Design hierarchy
- [ ] ✅ TypeScript Strict
- [ ] ✅ State Management (React Query)
- [ ] ✅ Component-Driven (Storybook)
- [ ] ✅ Form-First (RHF + Zod)
- [ ] ✅ API-Driven (SDK usage)
- [ ] ✅ Zero Secrets
- [ ] ✅ GitFlow Protected
- [ ] ✅ Test-Driven
- [ ] ✅ Design System (Chakra UI v3)
- [ ] ✅ Accessibility
- [ ] ✅ Developer Experience

## 🚨 Common Pitfalls

### Chakra UI v3 Migration
```tsx
// ❌ Props v2 (causam errors)
isOpen, isDisabled, isInvalid, colorScheme

// ✅ Props v3 (corretas)
open, disabled, invalid, colorPalette
```

### React Query Keys
```tsx
// ❌ Inconsistente
['simulations'], ['loan-sim', id], ['loans']

// ✅ Consistente
['loan-simulations'], ['loan-simulations', id]
```

### Form Validation
```tsx
// ❌ Sem schema
<Input onChange={validate} />

// ✅ Com Zod + RHF
<Input {...register('amount')} />
```

### Import Organization
```tsx
// ✅ Ordem correta
import React from 'react'
import { Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { loanSimulationService } from '@/services'
import type { LoanSimulation } from '@/types'
```

## 📞 Support & Resources

### Documentação
- [Chakra UI v3 Patterns](../research.md)
- [React Query Patterns](../research.md)
- [Constitution](/.specify/memory/constitution.md)

### Local References
- Existing hooks: `src/hooks/useTransactions.ts`
- Form examples: `src/components/organisms/forms/`
- Service examples: `src/services/transactionService.ts`

### Debug Tools
- React Query DevTools (development)
- Chakra UI DevTools
- TypeScript IntelliSense
- Storybook visual testing

---

**🎯 Success Criteria**: Implementação completa seguindo constitution, testes passando, Storybook atualizado, pronto para merge na main.