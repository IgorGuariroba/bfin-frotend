import { useCreateExpense } from './useTransactions';
import { useAccounts } from './useAccounts';
import { toast } from '../lib/toast';
import type { CreateExpenseDTO } from '../types/transaction';
import type { ExpenseFormData } from './useExpenseFormState';
import { createISODateTime } from '../utils/date';

interface UseExpenseSubmissionProps {
  onSuccess?: () => void;
}

export function useExpenseSubmission({ onSuccess }: UseExpenseSubmissionProps) {
  const createExpense = useCreateExpense();
  const { refetchAccounts } = useAccounts();

  const submitExpense = async (data: ExpenseFormData) => {
    try {
      let dueDateIso: string | undefined;

      if (data.dueDate && data.type === 'fixed') {
        const time = data.dueTime || '00:00';
        dueDateIso = createISODateTime(data.dueDate, time);
      }

      const payload: CreateExpenseDTO = {
        accountId: data.accountId,
        amount: Number(data.amount),
        description: data.description,
        categoryId: data.categoryId,
        type: data.type,
        dueDate: dueDateIso,
        isRecurring: data.isRecurring,
        recurrencePattern: data.isRecurring ? (data.recurrencePattern || 'monthly') : undefined,
        recurrenceInterval: data.recurrenceInterval ?? undefined,
        indefinite: data.indefinite,
        recurrenceCount: data.recurrenceCount ?? undefined,
      };

      await createExpense.mutateAsync(payload);
      await refetchAccounts();

      toast.success(
        data.type === 'fixed'
          ? 'Despesa fixa criada com sucesso!'
          : 'Despesa variável criada com sucesso!'
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Erro ao criar despesa');
    }
  };

  return {
    submitExpense,
    isSubmitting: createExpense.isPending,
    error: createExpense.error,
    isError: createExpense.isError,
  };
}