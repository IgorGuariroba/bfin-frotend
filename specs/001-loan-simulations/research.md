# Research Report: Sistema de Simulação de Empréstimos

**Date**: 2026-02-01
**Feature**: 001-loan-simulations
**Purpose**: Resolver questões técnicas e estabelecer padrões para implementação

## Decisões de Implementação

### Decision 1: Padrões Chakra UI v3
**What was chosen**: Estrutura Root/Content/Item com props v3 (open, disabled, invalid)
**Rationale**: Chakra UI v3 quebrou compatibilidade com v2. Uso correto evita runtime errors e garante consistência visual com o design system existente
**Alternatives considered**:
- Manter sintaxe v2 (REJEITADO: causa erros de runtime)
- Migrar gradualmente (REJEITADO: inconsistência visual)
- Usar biblioteca alternativa (REJEITADO: quebra constituição)

**Implementation details**:
- Formulários: `Field.Root` + `Field.Label` + `Field.ErrorText`
- Dialogs: `Dialog.Root` + `Dialog.Content` + `Dialog.Header`
- Tables: `Table.Root` + `Table.Header` + `Table.Body`
- Props: `open` vs `isOpen`, `disabled` vs `isDisabled`, `invalid` vs `isInvalid`

### Decision 2: Estratégia React Query
**What was chosen**: Custom hooks seguindo padrão existente do projeto com cache invalidation centralizado
**Rationale**: Mantém consistência com hooks existentes (useTransactions, useAccounts) e aproveita sistema de invalidation já implementado
**Alternatives considered**:
- Query diretas nos componentes (REJEITADO: viola princípio Component-Driven)
- SDK hooks apenas (REJEITADO: não permite otimizações específicas)
- Redux/Zustand (REJEITADO: viola constituição State Management)

**Implementation details**:
- `useLoanSimulations()` - listagem com filtros e ordenação
- `useLoanSimulationDetails(id)` - detalhes individuais com computed properties
- `useEmergencyReserve()` - dados da reserva com cálculo de limite disponível
- Query keys hierárquicas: `['loan-simulations']`, `['loan-simulations', id]`
- Mutations com optimistic updates e rollback automático

### Decision 3: Estrutura de Componentes
**What was chosen**: Atomic Design rigoroso com separação clara de responsabilidades
**Rationale**: Segue constituição estabelecida e facilita reutilização/manutenção
**Alternatives considered**:
- Componentes monolíticos (REJEITADO: viola Atomic Design)
- Estrutura flat (REJEITADO: dificulta organização)
- Feature folders (REJEITADO: quebra convenção existente)

**Implementation details**:
```
atoms/: elementos básicos reutilizáveis
molecules/: LoanSimulationCard, SimulationSummary, InstallmentRow
organisms/: LoanSimulationForm, LoanSimulationList, *Dialog components
pages/: LoanSimulations (listagem), LoanSimulationDetails (detalhes)
```

### Decision 4: Validação e Tipos
**What was chosen**: TypeScript strict + Zod schema + tipos do SDK quando disponíveis
**Rationale**: Garante type safety end-to-end e aproveitamento máximo dos tipos do SDK privado
**Alternatives considered**:
- Joi validation (REJEITADO: não integra com React Hook Form)
- Yup validation (REJEITADO: Zod é padrão do projeto)
- Custom validation (REJEITADO: duplica esforço)

**Implementation details**:
- Schemas Zod para formulários de criação e aprovação
- Tipos do SDK: `LoanSimulation`, `LoanSimulationStatus`
- Interfaces locais apenas quando SDK não oferece
- Validação client-side com mensagens específicas

### Decision 5: Responsividade e Acessibilidade
**What was chosen**: Mobile-first com breakpoints Chakra UI v3 + ARIA completo
**Rationale**: Segue constituição de acessibilidade e mobile-first design
**Alternatives considered**:
- Desktop-first (REJEITADO: não mobile-first)
- Componentes separados mobile/desktop (REJEITADO: duplica código)
- Acessibilidade básica (REJEITADO: viola constituição)

**Implementation details**:
- Breakpoints: `base`, `md`, `lg` para layouts adaptativos
- ARIA labels em formulários e tabelas
- Keyboard navigation completa
- Screen reader support com semantic HTML

## Padrões Técnicos Estabelecidos

### Hook Pattern
```typescript
export const useLoanSimulations = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['loan-simulations'],
    queryFn: () => loanSimulationService.list(),
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

### Form Pattern (Chakra UI v3)
```typescript
<Field.Root invalid={!!errors.amount}>
  <Field.Label>Valor do Empréstimo</Field.Label>
  <Input
    {...register('amount')}
    placeholder="R$ 0,00"
    type="number"
  />
  {errors.amount && (
    <Field.ErrorText>{errors.amount.message}</Field.ErrorText>
  )}
</Field.Root>
```

### Dialog Pattern (Chakra UI v3)
```typescript
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Backdrop />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Detalhes da Simulação</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>
      {/* Conteúdo */}
    </Dialog.Body>
  </Dialog.Content>
</Dialog.Root>
```

### Table Pattern (Chakra UI v3)
```typescript
<Table.Root variant="line">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Parcela</Table.ColumnHeader>
      <Table.ColumnHeader>Valor</Table.ColumnHeader>
      <Table.ColumnHeader>Vencimento</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {installments.map((installment, index) => (
      <Table.Row key={index}>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{formatCurrency(installment.amount)}</Table.Cell>
        <Table.Cell>{formatDate(installment.dueDate)}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table.Root>
```

## Dependências Confirmadas

### Já Disponíveis no Projeto
- ✅ Chakra UI v3.30.0 (configurado)
- ✅ React Query 5.17.9 (configurado)
- ✅ React Hook Form 7.49.3 + Zod 3.22.4 (configurado)
- ✅ @igorguariroba/bfin-sdk 0.12.0 (com endpoints LoanSimulations)
- ✅ TypeScript 5.3.3 strict mode (configurado)
- ✅ Vitest + Playwright (configurado)

### Utilitários Necessários
- ✅ date-fns (já disponível - formatação de datas)
- ✅ Lucide React (já disponível - ícones)
- ✅ Existing theme orange palette (já configurado)

## Riscos Identificados e Mitigações

### Risco 1: Complexidade Chakra UI v3
**Mitigation**: Documentação criada com patterns específicos, exemplos práticos de migração v2→v3

### Risco 2: Cache Invalidation Complexo
**Mitigation**: Aproveitamento do sistema existente `useCacheInvalidation`, patterns testados no projeto

### Risco 3: Acessibilidade em Tabelas Complexas
**Mitigation**: HTML semântico, ARIA labels, versão responsiva com cards para mobile

### Risco 4: Performance com Muitas Simulações
**Mitigation**: React Query com stale time otimizado, paginação se necessário, virtualization para listas grandes

## Próximos Passos

1. **Phase 1**: Criar data-model.md com entidades mapeadas
2. **Phase 1**: Gerar contratos API para documentação
3. **Phase 1**: Criar quickstart.md para desenvolvimento
4. **Phase 2**: Implementar componentes seguindo os patterns estabelecidos
5. **Phase 2**: Testes unitários e E2E seguindo patterns existentes

**Status**: ✅ Research completo - todas as questões técnicas resolvidas