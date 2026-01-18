import { useMutation, useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import { useCacheInvalidation } from './useCacheInvalidation';
import type {
  CreateIncomeDTO,
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

export function useCreateFixedExpense() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (data: CreateFixedExpenseDTO) => transactionService.createFixedExpense(data),
    onSuccess: () => {
      invalidateTransactionRelatedQueries();
    },
  });
}

export function useCreateVariableExpense() {
  const { invalidateTransactionRelatedQueries } = useCacheInvalidation();

  return useMutation({
    mutationFn: (data: CreateVariableExpenseDTO) => transactionService.createVariableExpense(data),
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
    queryKey: ['transactions', { type: 'fixed_expense', status: 'locked' }],
    queryFn: () => transactionService.list({
      type: 'fixed_expense',
      status: 'locked',
      limit: 10
    }),
  });
}
