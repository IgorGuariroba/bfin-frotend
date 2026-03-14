/**
 * Types and interfaces for Loan Simulations feature
 * Based on data-model.md and API specifications
 */

import { z } from 'zod'

// ============================================================================
// Core Domain Types
// ============================================================================

export type LoanSimulationStatus = 'PENDING' | 'APPROVED' | 'COMPLETED'

export type AmortizationType = 'PRICE'

/**
 * Simulação de empréstimo usando reserva de emergência como garantia
 */
export interface LoanSimulation {
  // Identificação
  id: string
  createdAt: string

  // Parâmetros da simulação
  amount: number // R$ 500 - R$ 100.000
  termMonths: number // 6-60 meses
  interestRateMonthly: number // % mensal validado pelo sistema

  // Tipo de amortização (sempre PRICE por enquanto)
  amortizationType: AmortizationType

  // Valores calculados
  installmentAmount: number // valor da parcela
  totalInterest: number // juros totais
  totalCost: number // valor total a ser pago

  // Impacto na reserva
  reserveUsagePercent: number // % da reserva utilizada
  reserveRemainingAmount: number // valor restante na reserva
  monthlyCashflowImpact: number // impacto mensal no fluxo

  // Estados e controle
  status: LoanSimulationStatus
  approvedAt?: string | null
  withdrawnAt?: string | null

  // Cronograma detalhado
  installmentPlan: InstallmentPlan[]
}

/**
 * Parcela individual do cronograma de reposição da reserva
 */
export interface InstallmentPlan {
  // Identificação da parcela
  installmentNumber: number // 1 a termMonths

  // Valores financeiros
  principalAmount: number // valor do principal
  interestAmount: number // valor dos juros
  totalAmount: number // valor total da parcela

  // Controle temporal
  dueDate: string // ISO date, data de vencimento

  // Saldos acumulados
  remainingPrincipal: number // principal restante
  accumulatedInterest: number // juros acumulados
  accumulatedPrincipal: number // principal pago acumulado
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Requisição para criar nova simulação de empréstimo
 */
export interface CreateLoanSimulationRequest {
  amount: number
  termMonths: number
  interestRateMonthly: number
}

/**
 * Resposta da API para listagem de simulações
 */
export interface LoanSimulationListResponse {
  simulations: LoanSimulation[]
  pagination: PaginationInfo
}

/**
 * Informações de paginação
 */
export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/**
 * Estrutura de erro da API
 */
export interface ApiError {
  error: string
  message: string
  details?: Record<string, unknown>
}

// ============================================================================
// Form and UI Types
// ============================================================================

/**
 * Estado da lista de simulações na UI
 */
export interface LoanSimulationListState {
  simulations: LoanSimulation[]
  isLoading: boolean
  error: string | null
  filters: {
    status?: LoanSimulationStatus
    limit: number
    offset: number
  }
  pagination: PaginationInfo
}

/**
 * Estado dos detalhes de simulação na UI
 */
export interface LoanSimulationDetailsState {
  simulation: LoanSimulation | null
  isLoading: boolean
  error: string | null
  isApproving: boolean
  isWithdrawing: boolean
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface LoanSimulationCardProps {
  simulation: LoanSimulation
  onClick?: () => void
  onApprove?: (simulation: LoanSimulation) => void
  onWithdraw?: (simulation: LoanSimulation) => void
  showActions?: boolean
}

export interface LoanSimulationFormProps {
  onSubmit: (data: CreateLoanSimulationFormData) => void
  isLoading?: boolean
  initialValues?: Partial<CreateLoanSimulationFormData>
}

export interface InstallmentScheduleProps {
  installments: InstallmentPlan[]
  currency?: string
  showHeaders?: boolean
  responsive?: boolean
}

export interface SimulationSummaryProps {
  simulation: LoanSimulation
  showDetails?: boolean
  showActions?: boolean
  onApprove?: () => void
  onWithdraw?: () => void
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseLoanSimulationsReturn {
  simulations: LoanSimulation[]
  isLoading: boolean
  error: string | null
  createSimulation: (data: CreateLoanSimulationRequest) => Promise<void>
  isCreating: boolean
  refetch: () => void
  loadMore: () => void
  hasMore: boolean
  filters: {
    status?: LoanSimulationStatus
  }
  setFilters: (filters: { status?: LoanSimulationStatus }) => void
}

export interface UseLoanSimulationDetailsReturn {
  simulation: LoanSimulation | null
  isLoading: boolean
  error: string | null
  approve: () => Promise<void>
  isApproving: boolean
  withdraw: () => Promise<void>
  isWithdrawing: boolean
  refetch: () => void
}

// ============================================================================
// Utility Types
// ============================================================================

export type LoanSimulationAction = 'approve' | 'withdraw' | 'view' | 'edit'

export interface LoanSimulationActionability {
  canApprove: boolean
  canWithdraw: boolean
  canEdit: boolean
  canView: boolean
  reasons: {
    approve?: string
    withdraw?: string
    edit?: string
  }
}

export interface LoanCalculationResult {
  installmentAmount: number
  totalInterest: number
  totalCost: number
  effectiveAnnualRate: number
  installmentPlan: InstallmentPlan[]
}

// ============================================================================
// Filter and Sort Types
// ============================================================================

export type LoanSimulationSortField = 'createdAt' | 'amount' | 'status' | 'termMonths'
export type SortDirection = 'asc' | 'desc'

export interface LoanSimulationFilters {
  status?: LoanSimulationStatus[]
  amountRange?: {
    min?: number
    max?: number
  }
  termRange?: {
    min?: number
    max?: number
  }
  dateRange?: {
    start?: string
    end?: string
  }
}

export interface LoanSimulationSortOptions {
  field: LoanSimulationSortField
  direction: SortDirection
}

// ============================================================================
// Constants
// ============================================================================

export const LOAN_SIMULATION_CONSTANTS = {
  MIN_AMOUNT: 500,
  MAX_AMOUNT: 100000,
  MIN_TERM_MONTHS: 6,
  MAX_TERM_MONTHS: 60,
  RESERVE_LIMIT_PERCENT: 70,
  EXPIRATION_DAYS: 30,
  AMORTIZATION_TYPE: 'PRICE' as const,
} as const

export const LOAN_SIMULATION_STATUS_LABELS: Record<LoanSimulationStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  COMPLETED: 'Concluído',
} as const

export const LOAN_SIMULATION_STATUS_COLORS: Record<LoanSimulationStatus, string> = {
  PENDING: 'orange',
  APPROVED: 'blue',
  COMPLETED: 'green',
} as const

// ============================================================================
// Error Types
// ============================================================================

export interface LoanSimulationError extends ApiError {
  type: 'validation' | 'business_rule' | 'system' | 'network'
  field?: string
  code?: string
}

export type LoanSimulationValidationError = LoanSimulationError & {
  type: 'validation'
  field: keyof CreateLoanSimulationFormData
}

export type LoanSimulationBusinessRuleError = LoanSimulationError & {
  type: 'business_rule'
  code: 'INSUFFICIENT_RESERVE' | 'SIMULATION_EXPIRED' | 'INVALID_STATUS' | 'EXCEEDS_LIMIT'
}

// ============================================================================
// Test Types
// ============================================================================

export interface LoanSimulationTestData {
  validSimulation: CreateLoanSimulationRequest
  invalidSimulation: Partial<CreateLoanSimulationRequest>
  mockSimulation: LoanSimulation
}

export interface LoanSimulationTestScenario {
  name: string
  input: CreateLoanSimulationRequest
  expectedOutput: Partial<LoanSimulation>
  expectError?: boolean
  errorCode?: string
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

/**
 * Schema de validação para criação de simulação de empréstimo
 */
export const createLoanSimulationSchema = z.object({
  amount: z
    .number({
      required_error: 'Valor é obrigatório',
      invalid_type_error: 'Valor deve ser um número',
    })
    .min(LOAN_SIMULATION_CONSTANTS.MIN_AMOUNT, `Valor mínimo é R$ ${LOAN_SIMULATION_CONSTANTS.MIN_AMOUNT.toLocaleString()}`)
    .max(LOAN_SIMULATION_CONSTANTS.MAX_AMOUNT, `Valor máximo é R$ ${LOAN_SIMULATION_CONSTANTS.MAX_AMOUNT.toLocaleString()}`)
    .positive('Valor deve ser positivo'),

  termMonths: z
    .number({
      required_error: 'Prazo é obrigatório',
      invalid_type_error: 'Prazo deve ser um número',
    })
    .int('Prazo deve ser um número inteiro')
    .min(LOAN_SIMULATION_CONSTANTS.MIN_TERM_MONTHS, `Prazo mínimo é ${LOAN_SIMULATION_CONSTANTS.MIN_TERM_MONTHS} meses`)
    .max(LOAN_SIMULATION_CONSTANTS.MAX_TERM_MONTHS, `Prazo máximo é ${LOAN_SIMULATION_CONSTANTS.MAX_TERM_MONTHS} meses`),

  interestRateMonthly: z
    .number({
      required_error: 'Taxa de juros é obrigatória',
      invalid_type_error: 'Taxa deve ser um número',
    })
    .min(0, 'Taxa deve ser positiva')
    .max(10, 'Taxa máxima é 10% ao mês'),
})

/**
 * Schema para validação de filtros de listagem
 */
export const loanSimulationFiltersSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'COMPLETED']).optional(),
  amountRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  termRange: z.object({
    min: z.number().int().min(1).optional(),
    max: z.number().int().min(1).optional(),
  }).optional(),
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
  }).optional(),
})

/**
 * Schema para validação de parâmetros de paginação
 */
export const paginationSchema = z.object({
  limit: z
    .number()
    .int()
    .min(1, 'Limite mínimo é 1')
    .max(100, 'Limite máximo é 100')
    .default(20),

  offset: z
    .number()
    .int()
    .min(0, 'Offset deve ser não-negativo')
    .default(0),
})

/**
 * Schema de validação para parcela do cronograma
 */
export const installmentPlanSchema = z.object({
  installmentNumber: z.number().int().min(1, 'Número da parcela deve ser positivo'),
  principalAmount: z.number().min(0, 'Valor do principal deve ser não-negativo'),
  interestAmount: z.number().min(0, 'Valor dos juros deve ser não-negativo'),
  totalAmount: z.number().min(0, 'Valor total deve ser não-negativo'),
  dueDate: z.string().datetime('Data de vencimento inválida'),
  remainingPrincipal: z.number().min(0, 'Principal restante deve ser não-negativo'),
  accumulatedInterest: z.number().min(0, 'Juros acumulados devem ser não-negativos'),
  accumulatedPrincipal: z.number().min(0, 'Principal acumulado deve ser não-negativo'),
})

/**
 * Schema completo para validação de simulação de empréstimo
 */
export const loanSimulationSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  createdAt: z.string().datetime('Data de criação inválida'),
  amount: z.number().min(LOAN_SIMULATION_CONSTANTS.MIN_AMOUNT).max(LOAN_SIMULATION_CONSTANTS.MAX_AMOUNT),
  termMonths: z.number().int().min(LOAN_SIMULATION_CONSTANTS.MIN_TERM_MONTHS).max(LOAN_SIMULATION_CONSTANTS.MAX_TERM_MONTHS),
  interestRateMonthly: z.number().min(0).max(10),
  amortizationType: z.literal('PRICE'),
  installmentAmount: z.number().min(0),
  totalInterest: z.number().min(0),
  totalCost: z.number().min(0),
  reserveUsagePercent: z.number().min(0).max(100),
  reserveRemainingAmount: z.number().min(0),
  monthlyCashflowImpact: z.number().min(0),
  status: z.enum(['PENDING', 'APPROVED', 'COMPLETED']),
  approvedAt: z.string().datetime().nullable(),
  withdrawnAt: z.string().datetime().nullable(),
  installmentPlan: z.array(installmentPlanSchema),
})

// ============================================================================
// Inferred Types from Schemas
// ============================================================================

export type CreateLoanSimulationFormData = z.infer<typeof createLoanSimulationSchema>
export type LoanSimulationFiltersData = z.infer<typeof loanSimulationFiltersSchema>
export type PaginationData = z.infer<typeof paginationSchema>
export type InstallmentPlanData = z.infer<typeof installmentPlanSchema>
export type LoanSimulationData = z.infer<typeof loanSimulationSchema>

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Valida se uma simulação pode ser aprovada (não expirou 30 dias)
 */
export function canApproveSimulation(simulation: LoanSimulation): boolean {
  if (simulation.status !== 'PENDING') {
    return false
  }

  const createdDate = new Date(simulation.createdAt)
  const expirationDate = new Date(createdDate.getTime() + (LOAN_SIMULATION_CONSTANTS.EXPIRATION_DAYS * 24 * 60 * 60 * 1000))
  const now = new Date()

  return now <= expirationDate
}

/**
 * Valida se uma simulação pode ser sacada
 */
export function canWithdrawSimulation(simulation: LoanSimulation): boolean {
  return simulation.status === 'APPROVED'
}

/**
 * Calcula dias restantes para expiração da simulação
 */
export function getDaysUntilExpiration(simulation: LoanSimulation): number {
  const createdDate = new Date(simulation.createdAt)
  const expirationDate = new Date(createdDate.getTime() + (LOAN_SIMULATION_CONSTANTS.EXPIRATION_DAYS * 24 * 60 * 60 * 1000))
  const now = new Date()

  const diffTime = expirationDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * Calcula a porcentagem de uso da reserva para um valor
 */
export function calculateReserveUsagePercent(amount: number, totalReserve: number): number {
  if (totalReserve === 0) return 0
  return amount / totalReserve
}