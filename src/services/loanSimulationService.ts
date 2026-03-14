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
      return await customInstance({
        url: `/api/v1/loan-simulations/${id}`,
        method: 'GET',
      })
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
    const createdDate = new Date(simulation.createdAt)
    const expirationDate = new Date(createdDate.getTime() + (30 * 24 * 60 * 60 * 1000))
    const now = new Date()

    const diffTime = expirationDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  },

  /**
   * Formata valores monetários
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  },

  /**
   * Formata porcentagens
   */
  formatPercentage(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  },

  /**
   * Formata datas
   */
  formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString))
  },

  /**
   * Formata data e hora
   */
  formatDateTime(dateString: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  },
}