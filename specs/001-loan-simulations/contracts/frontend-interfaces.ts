/**
 * Frontend TypeScript Interfaces for Loan Simulations
 * Generated from OpenAPI specification
 *
 * Note: These interfaces should be used in conjunction with SDK types when available.
 * Prefer SDK types from @igorguariroba/bfin-sdk when they exist.
 */

// ============================================================================
// Core Domain Types
// ============================================================================

export interface LoanSimulation {
  // Identification
  id: string
  createdAt: string

  // Simulation parameters
  amount: number
  termMonths: number
  interestRateMonthly: number

  // System fields
  amortizationType: 'PRICE'

  // Calculated values
  installmentAmount: number
  totalInterest: number
  totalCost: number

  // Reserve impact
  reserveUsagePercent: number
  reserveRemainingAmount: number
  monthlyCashflowImpact: number

  // Status and timeline
  status: LoanSimulationStatus
  approvedAt?: string
  withdrawnAt?: string

  // Payment schedule
  installmentPlan: InstallmentPlan[]
}

export type LoanSimulationStatus = 'PENDING' | 'APPROVED' | 'COMPLETED'

export interface InstallmentPlan {
  installmentNumber: number
  principalAmount: number
  interestAmount: number
  totalAmount: number
  dueDate: string
  remainingPrincipal: number
  accumulatedInterest: number
  accumulatedPrincipal: number
}

export interface EmergencyReserveStatus {
  totalReserve: number
  availableReserve: number
  loanLimit: number
  currentLoansAmount: number
  remainingLoanCapacity: number
  lastUpdated: string
  accountId: string
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateLoanSimulationRequest {
  amount: number
  termMonths: number
  interestRateMonthly: number
}

export interface LoanSimulationListResponse {
  simulations: LoanSimulation[]
  pagination: PaginationInfo
}

export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface ApiError {
  error: string
  message: string
  details?: Record<string, any>
}

// ============================================================================
// Form Validation Schemas (Zod)
// ============================================================================

import { z } from 'zod'

export const createLoanSimulationSchema = z.object({
  amount: z
    .number()
    .min(500, 'Valor mínimo é R$ 500')
    .max(100000, 'Valor máximo é R$ 100.000'),
  termMonths: z
    .number()
    .int()
    .min(6, 'Prazo mínimo é 6 meses')
    .max(60, 'Prazo máximo é 60 meses'),
  interestRateMonthly: z
    .number()
    .min(0, 'Taxa deve ser positiva')
    .max(10, 'Taxa máxima é 10% ao mês'),
})

export type CreateLoanSimulationFormData = z.infer<typeof createLoanSimulationSchema>

// ============================================================================
// UI State Types
// ============================================================================

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

export interface LoanSimulationDetailsState {
  simulation: LoanSimulation | null
  isLoading: boolean
  error: string | null
  isApproving: boolean
  isWithdrawing: boolean
}

export interface EmergencyReserveState {
  status: EmergencyReserveStatus | null
  isLoading: boolean
  error: string | null
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
  emergencyReserve?: EmergencyReserveStatus
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

export interface LoanSimulationListProps {
  simulations: LoanSimulation[]
  isLoading?: boolean
  error?: string | null
  onSimulationClick?: (simulation: LoanSimulation) => void
  onLoadMore?: () => void
  hasMore?: boolean
  filters?: {
    status?: LoanSimulationStatus
  }
  onFiltersChange?: (filters: { status?: LoanSimulationStatus }) => void
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

export interface UseEmergencyReserveReturn {
  status: EmergencyReserveStatus | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  hasCapacity: (amount: number) => boolean
  getMaxLoanAmount: () => number
  getUsagePercentage: () => number
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
  mockEmergencyReserve: EmergencyReserveStatus
}

export interface LoanSimulationTestScenario {
  name: string
  input: CreateLoanSimulationRequest
  expectedOutput: Partial<LoanSimulation>
  expectError?: boolean
  errorCode?: string
}