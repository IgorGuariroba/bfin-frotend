import { useCreateTransfer } from './useTransactions';
import { useAccounts } from './useAccounts';
import { toast } from '../lib/toast';
import type { CreateTransferDTO } from '../types/transaction';
import type { TransferFormData } from './useTransferFormState';

interface UseTransferSubmissionProps {
  onSuccess?: () => void;
  availableBalance: number;
  onFormReset: () => void;
}

export function useTransferSubmission({
  onSuccess,
  availableBalance,
  onFormReset
}: UseTransferSubmissionProps) {
  const createTransfer = useCreateTransfer();
  const { refetchAccounts } = useAccounts();

  const submitTransfer = async (data: TransferFormData) => {
    if (data.amount > availableBalance) {
      toast.error('Saldo insuficiente');
      return;
    }

    try {
      const payload: CreateTransferDTO = {
        sourceAccountId: data.sourceAccountId,
        destinationAccountId: data.destinationAccountId,
        amount: Number(data.amount),
        description: data.description,
      };

      await createTransfer.mutateAsync(payload);

      // Forçar atualização dos dados de accounts
      await refetchAccounts();

      toast.success('Transferência realizada com sucesso!');

      // Reset do formulário
      onFormReset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Erro ao realizar transferência';
      toast.error(message);
    }
  };

  return {
    submitTransfer,
    isSubmitting: createTransfer.isPending,
    error: createTransfer.error,
    isError: createTransfer.isError,
  };
}