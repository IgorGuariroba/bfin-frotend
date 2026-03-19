import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Account } from '@igorguariroba/bfin-sdk/client';

const transferSchema = z.object({
  sourceAccountId: z.string().min(1, 'Conta de origem é obrigatória'),
  destinationAccountId: z.string().min(1, 'ID da conta de destino é obrigatório'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

export type TransferFormData = z.infer<typeof transferSchema>;

interface UseTransferFormStateProps {
  accounts?: Account[];
}

export function useTransferFormState({ accounts }: UseTransferFormStateProps) {
  const [amountInputValue, setAmountInputValue] = useState('');

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountId: '',
      destinationAccountId: '',
      amount: 0,
      description: '',
    },
  });

  const selectedSourceAccountId = form.watch('sourceAccountId');
  const amount = form.watch('amount') || 0;

  const sourceAccount = accounts?.find((acc) => acc.id === selectedSourceAccountId);
  const availableBalance = sourceAccount?.available_balance || 0;

  // Auto-selecionar conta padrão
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedSourceAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        form.setValue('sourceAccountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedSourceAccountId, form]);

  const handleAmountChange = (value: string) => {
    setAmountInputValue(value);
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    form.setValue('amount', numericValue, { shouldValidate: true });
  };

  return {
    form,
    state: {
      amountInputValue,
      selectedSourceAccountId,
      amount,
      sourceAccount,
      availableBalance,
    },
    actions: {
      handleAmountChange,
    },
  };
}