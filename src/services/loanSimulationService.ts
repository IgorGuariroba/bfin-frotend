/**
 * Service layer for Loan Simulations
 * Abstracts SDK calls and provides type-safe interface for the application
 */

import { customInstance } from '@igorguariroba/bfin-sdk'
import type {
  LoanSimulation,
  CreateLoanSimulationRequest,
  LoanSimulationListResponse,
  LoanSimulationStatus,
  ApiError
} from '../types/loanSimulation'

// ============================================================================
// Loan Simulation Service
// ============================================================================

export const loanSimulationService = {
  /**
   * Criar nova simulação de empréstimo
   */
  async create(data: CreateLoanSimulationRequest): Promise<LoanSimulation> {
    try {
      return await customInstance({
        url: '/api/v1/loan-simulations',
        method: 'POST',
        data,
      })
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar simulação')
    }
  },

  /**
   * Listar simulações com filtros opcionais
   */
  async list(params?: {
    limit?: number
    offset?: number
    status?: LoanSimulationStatus
  }): Promise<LoanSimulationListResponse> {
    try {
      const response = await customInstance({
        url: '/api/v1/loan-simulations',
        method: 'GET',
        params,
      })

      // Se a resposta não tiver o formato esperado, padronizamos
      if (Array.isArray(response)) {
        return {
          simulations: response,
          pagination: {
            total: response.length,
            limit: params?.limit || 20,
            offset: params?.offset || 0,
            hasMore: false,
          }
        }
      }

      return response as LoanSimulationListResponse
    } catch (error) {
      throw this.handleError(error, 'Erro ao carregar simulações')
    }
  },

  /**
   * Obter simulação por ID
   */
  async getById(id: string): Promise<LoanSimulation> {
    try {
      const response = await customInstance<LoanSimulation>({
        url: `/api/v1/loan-simulations/${id}`,
        method: 'GET',
      })
      
      // Mapeia os campos do installmentPlan da API para o formato do frontend
      if (response?.installmentPlan) {
        response.installmentPlan = response.installmentPlan.map((item) => {
          const apiItem = item as unknown as Record<string, unknown>
          return {
            installmentNumber: item.installmentNumber,
            principalAmount: apiItem.principalComponent as number ?? item.principalAmount,
            interestAmount: apiItem.interestComponent as number ?? item.interestAmount,
            totalAmount: apiItem.totalPayment as number ?? item.totalAmount,
            dueDate: (apiItem.dueDate as string) ?? '',
            remainingPrincipal: apiItem.remainingBalance as number ?? item.remainingPrincipal,
            accumulatedInterest: apiItem.accumulatedInterest as number ?? 0,
            accumulatedPrincipal: apiItem.accumulatedPrincipal as number ?? 0,
          }
        })
      }
      
      return response
    } catch (error) {
      throw this.handleError(error, 'Erro ao carregar simulação')
    }
  },

  /**
   * Aprovar simulação
   */
  async approve(id: string): Promise<LoanSimulation> {
    try {
      return await customInstance({
        url: `/api/v1/loan-simulations/${id}/approve`,
        method: 'POST',
      })
    } catch (error) {
      throw this.handleError(error, 'Erro ao aprovar simulação')
    }
  },

  /**
   * Sacar fundos da simulação aprovada
   */
  async withdraw(id: string): Promise<LoanSimulation> {
    try {
      return await customInstance({
        url: `/api/v1/loan-simulations/${id}/withdraw`,
        method: 'POST',
      })
    } catch (error) {
      throw this.handleError(error, 'Erro ao sacar empréstimo')
    }
  },

  /**
   * Deletar simulação (apenas se status PENDING)
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      return await customInstance({
        url: `/api/v1/loan-simulations/${id}`,
        method: 'DELETE',
      })
    } catch (error) {
      throw this.handleError(error, 'Erro ao excluir simulação')
    }
  },

  // ============================================================================
  // Error Handling
  // ============================================================================

  /**
   * Padroniza tratamento de erros da API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any, defaultMessage: string): ApiError {
    // Se já é um erro estruturado da API, retorna como está
    if (error?.response?.data && typeof error.response.data === 'object') {
      const apiError = error.response.data
      return {
        error: apiError.error || 'API_ERROR',
        message: apiError.message || defaultMessage,
        details: apiError.details || {},
      }
    }

    // Se é um erro de rede ou outro tipo
    if (error?.message) {
      return {
        error: 'NETWORK_ERROR',
        message: error.message.includes('Network Error') ? 'Erro de conexão' : defaultMessage,
        details: { originalError: error.message },
      }
    }

    // Erro genérico
    return {
      error: 'UNKNOWN_ERROR',
      message: defaultMessage,
      details: { originalError: error },
    }
  },

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Valida se uma simulação pode ser aprovada
   */
  canApprove(simulation: LoanSimulation): { canApprove: boolean; reason?: string } {
    if (simulation.status !== 'PENDING') {
      return {
        canApprove: false,
        reason: 'Apenas simulações pendentes podem ser aprovadas'
      }
    }

    // Verificar expiração de 30 dias
    const createdDate = new Date(simulation.createdAt)
    const expirationDate = new Date(createdDate.getTime() + (30 * 24 * 60 * 60 * 1000))
    const now = new Date()

    if (now > expirationDate) {
      return {
        canApprove: false,
        reason: 'Simulação expirou (mais de 30 dias)'
      }
    }

    return { canApprove: true }
  },

  /**
   * Valida se uma simulação pode ser sacada
   */
  canWithdraw(simulation: LoanSimulation): { canWithdraw: boolean; reason?: string } {
    if (simulation.status !== 'APPROVED') {
      return {
        canWithdraw: false,
        reason: 'Apenas simulações aprovadas podem ser sacadas'
      }
    }

    return { canWithdraw: true }
  },

  /**
   * Calcula dias restantes para aprovação
   */
  getDaysUntilExpiration(simulation: LoanSimulation): number {
    if (!simulation?.createdAt) return 0
    const createdDate = new Date(simulation.createdAt)
    if (isNaN(createdDate.getTime())) return 0
    const expirationDate = new Date(createdDate.getTime() + (30 * 24 * 60 * 60 * 1000))
    const now = new Date()

    const diffTime = expirationDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  },

  /**
   * Formata valores monetários
   */
  formatCurrency(value: number | undefined | null): string {
    if (value == null || isNaN(Number(value))) {
      return 'R$ 0,00'
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  },

  /**
   * Formata porcentagens
   */
  formatPercentage(value: number | undefined | null, decimals: number = 2): string {
    if (value == null || isNaN(Number(value))) {
      return '0%'
    }
    // Se o valor já vem como porcentagem (ex: 75 para 75%), converte para decimal
    const decimalValue = value > 1 ? value / 100 : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(decimalValue)
  },

  /**
   * Formata datas
   */
  formatDate(dateString: string | undefined | null): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  },

  /**
   * Formata data e hora
   */
  formatDateTime(dateString: string | undefined | null): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  },
}