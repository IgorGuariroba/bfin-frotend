import { customInstance } from '@igorguariroba/bfin-sdk';
import type {
  CreateIncomeDTO,
  CreateFixedExpenseDTO,
  CreateVariableExpenseDTO,
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
   * Create fixed expense transaction
   */
  async createFixedExpense(data: CreateFixedExpenseDTO): Promise<CreateTransactionResponse> {
    return customInstance({
      url: '/api/v1/transactions/fixed-expense',
      method: 'POST',
      data,
    });
  },

  /**
   * Create variable expense transaction
   */
  async createVariableExpense(data: CreateVariableExpenseDTO): Promise<CreateTransactionResponse> {
    return customInstance({
      url: '/api/v1/transactions/variable-expense',
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
   * Mark fixed expense as paid
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
