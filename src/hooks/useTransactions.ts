import { useMutation, useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import { useCacheInvalidation } from './useCacheInvalidation';
import type {
  CreateIncomeDTO,
  CreateExpenseDTO,
  CreateFixedExpenseDTO,
  CreateVariableExpenseDTO,
  ListTransactionsParams,
} from '../types/transaction';

export function useTransactions(params?: ListTransactionsParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.list(params),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
}

export function useCreateIncome() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (data: CreateIncomeDTO) => transactionService.createIncome(data),
    onSuccess: () => {
      // Usar invalidação centralizada para garantir que todas as queries relevantes sejam atualizadas
      invalidateTransactionRelatedQueries();
    },
  });
}

/**
 * Hook unificado para criar despesas (fixas ou variáveis)
 */
export function useCreateExpense() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (data: CreateExpenseDTO) => transactionService.createExpense(data),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

/**
 * @deprecated Use useCreateExpense com type='fixed'
 */
export function useCreateFixedExpense() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (data: CreateFixedExpenseDTO) => 
      transactionService.createExpense({
        accountId: data.accountId,
        amount: data.amount,
        description: data.description,
        categoryId: data.categoryId,
        type: 'fixed',
        dueDate: data.dueDate,
        isRecurring: data.isRecurring,
        recurrencePattern: data.recurrencePattern,
      }),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

/**
 * @deprecated Use useCreateExpense com type='variable'
 */
export function useCreateVariableExpense() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (data: CreateVariableExpenseDTO) => 
      transactionService.createExpense({
        accountId: data.accountId,
        amount: data.amount,
        description: data.description,
        categoryId: data.categoryId,
        type: 'variable',
      }),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

export function useUpdateTransaction() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: ({ id, data }: {
      id: string;
      data: {
        amount?: number;
        description?: string;
        categoryId?: string;
        dueDate?: string;
      }
    }) => transactionService.update(id, data),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

export function useMarkAsPaid() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (id: string) => transactionService.markAsPaid(id),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

export function useDuplicateTransaction() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (id: string) => transactionService.duplicate(id),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

export function useDeleteTransaction() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

export function useUpcomingFixedExpenses() {
  return useQuery({
    queryKey: ['transactions', { type: 'fixed', status: 'locked' }],
    queryFn: () => transactionService.list({
      type: 'fixed',
      status: 'locked',
      limit: 10
    }),
  });
}
