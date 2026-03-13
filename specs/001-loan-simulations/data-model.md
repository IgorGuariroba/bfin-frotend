# Data Model: Sistema de Simulação de Empréstimos

**Date**: 2026-02-01
**Feature**: 001-loan-simulations
**Source**: Feature specification + API documentation analysis

## Entity Overview

O sistema trabalha com três entidades principais relacionadas aos empréstimos da reserva de emergência:

1. **LoanSimulation** - Simulação de empréstimo (entidade principal)
2. **InstallmentPlan** - Cronograma de reposição da reserva
3. **EmergencyReserveStatus** - Estado atual da reserva para validações

## Core Entities

### LoanSimulation

**Description**: Representa uma simulação de empréstimo usando a reserva de emergência como garantia.

**Attributes**:
```typescript
interface LoanSimulation {
  // Identificação
  id: string (UUID)
  createdAt: string (ISO date)

  // Parâmetros da simulação
  amount: number (decimal, R$ 500 - R$ 100.000)
  termMonths: number (integer, 6-60 meses)
  interestRateMonthly: number (decimal, %, validado pelo sistema)

  // Tipo de amortização (sempre PRICE por enquanto)
  amortizationType: 'PRICE'

  // Valores calculados
  installmentAmount: number (decimal, valor da parcela)
  totalInterest: number (decimal, juros totais)
  totalCost: number (decimal, valor total a ser pago)

  // Impacto na reserva
  reserveUsagePercent: number (decimal, % da reserva utilizada)
  reserveRemainingAmount: number (decimal, valor restante na reserva)
  monthlyCashflowImpact: number (decimal, impacto mensal no fluxo)

  // Estados e controle
  status: 'PENDING' | 'APPROVED' | 'COMPLETED'
  approvedAt?: string (ISO date, nullable)
  withdrawnAt?: string (ISO date, nullable)

  // Cronograma detalhado
  installmentPlan: InstallmentPlan[]
}
```

**Validation Rules**:
- `amount`: Deve estar entre R$ 500 e R$ 100.000
- `amount`: Não pode exceder 70% da reserva de emergência
- `termMonths`: Deve estar entre 6 e 60 meses
- `interestRateMonthly`: Deve estar dentro dos limites permitidos pelo sistema
- `status`: PENDING pode ir para APPROVED, APPROVED pode ir para COMPLETED
- Aprovação só é permitida dentro de 30 dias da criação
- Saque só é permitido para status APPROVED

**State Transitions**:
```
PENDING → APPROVED → COMPLETED
    ↑         ↑
    └─────────┘ (expiração 30 dias)
```

**Relationships**:
- Belongs to User (via authentication context)
- Has many InstallmentPlan (embedded)
- Validates against EmergencyReserveStatus (computation)

### InstallmentPlan

**Description**: Representa uma parcela individual do cronograma de reposição da reserva.

**Attributes**:
```typescript
interface InstallmentPlan {
  // Identificação da parcela
  installmentNumber: number (1 a termMonths)

  // Valores financeiros
  principalAmount: number (decimal, valor do principal)
  interestAmount: number (decimal, valor dos juros)
  totalAmount: number (decimal, valor total da parcela)

  // Controle temporal
  dueDate: string (ISO date, data de vencimento)

  // Saldos acumulados
  remainingPrincipal: number (decimal, principal restante)
  accumulatedInterest: number (decimal, juros acumulados)
  accumulatedPrincipal: number (decimal, principal pago acumulado)
}
```

**Validation Rules**:
- `installmentNumber`: Sequencial de 1 até termMonths
- `principalAmount + interestAmount = totalAmount`
- `dueDate`: Deve ser mensal a partir da aprovação
- `remainingPrincipal`: Deve decrescer a cada parcela
- `accumulatedPrincipal`: Deve crescer até igualar amount original

**Business Rules**:
- Cálculo baseado em tabela PRICE (parcelas fixas)
- Primeira parcela vence 30 dias após aprovação
- Juros calculados sobre saldo devedor
- Principal amortizado crescente a cada parcela

### EmergencyReserveStatus

**Description**: Estado atual da reserva de emergência para validações de limite.

**Attributes**:
```typescript
interface EmergencyReserveStatus {
  // Saldos atuais
  totalReserve: number (decimal, total da reserva)
  availableReserve: number (decimal, disponível para empréstimo)

  // Limites calculados
  loanLimit: number (decimal, 70% da reserva total)
  currentLoansAmount: number (decimal, valor já emprestado)
  remainingLoanCapacity: number (decimal, capacidade restante)

  // Metadata
  lastUpdated: string (ISO date)
  accountId: string (UUID, conta associada)
}
```

**Validation Rules**:
- `loanLimit = totalReserve * 0.7`
- `remainingLoanCapacity = loanLimit - currentLoansAmount`
- `availableReserve >= remainingLoanCapacity`
- Deve ser atualizado a cada operação que afete a reserva

**Business Rules**:
- 70% da reserva é o limite máximo para empréstimos
- Múltiplas simulações aprovadas contam para o limite
- Saques executados reduzem availableReserve imediatamente

## Computed Properties

### LoanSimulation Computed Fields

**monthlyPaymentPercentage**:
```typescript
(installmentAmount / totalReserve) * 100
```
Percentual da reserva que representa cada parcela.

**timeToRecovery**:
```typescript
termMonths // meses para recuperar totalmente a reserva
```

**effectiveAnnualRate**:
```typescript
((totalCost / amount) ** (12 / termMonths) - 1) * 100
```
Taxa efetiva anual do empréstimo.

**riskLevel**:
```typescript
reserveUsagePercent > 50 ? 'HIGH' :
reserveUsagePercent > 30 ? 'MEDIUM' : 'LOW'
```

### InstallmentPlan Computed Fields

**progressPercentage**:
```typescript
(installmentNumber / totalInstallments) * 100
```

**principalPercentage**:
```typescript
(principalAmount / totalAmount) * 100
```

**interestPercentage**:
```typescript
(interestAmount / totalAmount) * 100
```

## Data Flow

### Create Simulation Flow
1. User submits amount, termMonths, interestRateMonthly
2. System validates against EmergencyReserveStatus limits
3. System calculates all derived fields (installmentAmount, totalCost, etc.)
4. System generates InstallmentPlan array with monthly schedule
5. Simulation saved with status PENDING

### Approval Flow
1. System validates simulation is PENDING and not expired (30 days)
2. System re-validates against current EmergencyReserveStatus
3. Status updated to APPROVED, approvedAt timestamp set
4. Simulation locked for editing

### Withdrawal Flow
1. System validates simulation is APPROVED
2. System creates account transaction moving funds reserve → available
3. Status updated to COMPLETED, withdrawnAt timestamp set
4. EmergencyReserveStatus updated to reflect new balances

## Integration Points

### With BFIN SDK
- `LoanSimulation` maps directly to SDK `LoanSimulation` type
- `InstallmentPlan` maps to SDK `installmentPlan` array
- API endpoints: GET/POST `/api/v1/loan-simulations`, POST `/api/v1/loan-simulations/{id}/approve`, POST `/api/v1/loan-simulations/{id}/withdraw`

### With Account System
- `EmergencyReserveStatus` derived from account `emergency_reserve` field
- Withdrawal updates account `emergency_reserve` and `available_balance`
- Transactions logged for audit trail

### With Authentication
- All simulations scoped to authenticated user
- User ID implicit in all API calls
- No cross-user access permitted

## Cache Strategy

### React Query Keys
```typescript
['loan-simulations'] // List all simulations
['loan-simulations', simulationId] // Individual simulation
['emergency-reserve', accountId] // Reserve status
['loan-simulations', 'filters', { status, limit, offset }] // Filtered lists
```

### Invalidation Patterns
```typescript
// After create simulation
invalidateQueries(['loan-simulations'])
invalidateQueries(['emergency-reserve'])

// After approve simulation
invalidateQueries(['loan-simulations'])
invalidateQueries(['loan-simulations', simulationId])

// After withdraw
invalidateQueries(['loan-simulations'])
invalidateQueries(['loan-simulations', simulationId])
invalidateQueries(['emergency-reserve'])
invalidateQueries(['accounts']) // Account balances affected
```

## Performance Considerations

### Indexing Needs
- Primary: simulationId (UUID)
- Secondary: userId + status (for filtered queries)
- Secondary: userId + createdAt (for chronological ordering)

### Caching Strategy
- Simulations list: 5 minutes stale time
- Individual simulation: 10 minutes stale time
- Emergency reserve status: 1 minute stale time (frequent updates)

### Pagination
- Default: 20 simulations per page
- Max: 100 simulations per page
- Sort: createdAt DESC (newest first)

## Security Considerations

### Data Access
- User can only access own simulations
- No admin access pattern (not required for MVP)
- Emergency reserve data scoped to user's accounts only

### Sensitive Data
- Interest rates visible to user (not sensitive)
- Amounts and calculations visible to user
- No PII beyond what's already in account system

### Validation
- Server-side validation of all limits and rules
- Client-side validation for UX only
- No business logic in frontend that bypasses API validation