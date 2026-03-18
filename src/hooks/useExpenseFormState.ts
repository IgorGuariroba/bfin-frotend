import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const expenseSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  type: z.enum(['fixed', 'variable']),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.enum(['monthly', 'weekly', 'yearly']).optional(),
  recurrenceInterval: z.number().min(1).max(12).optional().nullable(),
  indefinite: z.boolean().optional(),
  recurrenceCount: z.number().min(1).max(60).optional().nullable(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

import type { Account } from '@igorguariroba/bfin-sdk/client';

interface UseExpenseFormStateProps {
  defaultType: 'fixed' | 'variable';
  accounts?: Account[];
}

export function useExpenseFormState({ defaultType, accounts }: UseExpenseFormStateProps) {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [expenseType, setExpenseType] = useState<'fixed' | 'variable'>(defaultType);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      accountId: '',
      amount: 0,
      type: defaultType,
      isRecurring: false,
      indefinite: false,
    },
  });

  const { watch, setValue } = form;

  const amount = watch('amount') || 0;
  const selectedAccountId = watch('accountId');
  const isRecurring = watch('isRecurring');

  // Auto-select default account
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('accountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedAccountId, setValue]);

  // Update form when defaultType changes
  useEffect(() => {
    setExpenseType(defaultType);
    setValue('type', defaultType);
  }, [defaultType, setValue]);

  const handleExpenseTypeChange = (newType: 'fixed' | 'variable') => {
    setExpenseType(newType);
    setValue('type', newType);
  };

  const handleAmountChange = (value: number) => {
    setValue('amount', value, { shouldValidate: true });
  };

  return {
    form: {
      ...form,
      watch,
      setValue,
    },
    state: {
      isCategoryDialogOpen,
      expenseType,
      amount,
      selectedAccountId,
      isRecurring,
    },
    actions: {
      setIsCategoryDialogOpen,
      handleExpenseTypeChange,
      handleAmountChange,
    },
  };
}