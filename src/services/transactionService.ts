import { customInstance } from '@igorguariroba/bfin-sdk';
import type {
  CreateIncomeDTO,
  CreateExpenseDTO,
  CreateTransactionResponse,
  ListTransactionsParams,
  TransactionListResponse,
  Transaction,
} from '../types/transaction';

export const transactionService = {
  /**
   * Create income transaction
   */
  async createIncome(data: CreateIncomeDTO): Promise<CreateTransactionResponse> {
    return customInstance({
      url: '/api/v1/transactions/income',
      method: 'POST',
      data,
    });
  },

  /**
   * Create expense transaction (fixed or variable)
   * Nova rota unificada: POST /api/v1/transactions/expense
   */
  async createExpense(data: CreateExpenseDTO): Promise<CreateTransactionResponse> {
    return customInstance({
      url: '/api/v1/transactions/expense',
      method: 'POST',
      data,
    });
  },

  /**
   * List transactions with filters
   */
  async list(params?: ListTransactionsParams): Promise<TransactionListResponse> {
    return customInstance({
      url: '/api/v1/transactions',
      method: 'GET',
      params,
    });
  },

  /**
   * Get transaction by ID
   */
  async getById(id: string): Promise<Transaction> {
    return customInstance({
      url: `/api/v1/transactions/${id}`,
      method: 'GET',
    });
  },

  /**
   * Update transaction
   */
  async update(
    id: string,
    data: {
      amount?: number;
      description?: string;
      categoryId?: string;
      dueDate?: string;
    }
  ): Promise<{ transaction: Transaction; message: string }> {
    return customInstance({
      url: `/api/v1/transactions/${id}`,
      method: 'PUT',
      data,
    });
  },

  /**
   * Mark transaction as paid
   */
  async markAsPaid(id: string): Promise<{ transaction: Transaction; message: string }> {
    return customInstance({
      url: `/api/v1/transactions/${id}/mark-as-paid`,
      method: 'POST',
    });
  },

  /**
   * Duplicate transaction
   */
  async duplicate(id: string): Promise<{ transaction: Transaction; message: string }> {
    return customInstance({
      url: `/api/v1/transactions/${id}/duplicate`,
      method: 'POST',
    });
  },

  /**
   * Delete transaction
   */
  async delete(id: string): Promise<{ message: string }> {
    return customInstance({
      url: `/api/v1/transactions/${id}`,
      method: 'DELETE',
    });
  },
};
