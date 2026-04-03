import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateIncome } from './useTransactions';
import { useAccounts } from './useAccounts';
import { useCategories } from './useCategories';
import { toast } from '../lib/toast';
import type { CreateIncomeDTO } from '../types/transaction';
import type { Category } from '@igorguariroba/bfin-sdk/client';
import type { CreatedTransactionData } from './useIncomeFormState';

const incomeSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  dueDate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return new Date(val).toISOString();
    }),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.enum(['monthly', 'weekly', 'yearly']).optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface UseIncomeFormLogicProps {
  actions: {
    setButtonState: (state: 'idle' | 'loading' | 'success') => void;
    setCreatedTransaction: (transaction: CreatedTransactionData | null) => void;
    setShowConfirmationModal: (show: boolean) => void;
    setAmountInputValue: (value: string) => void;
    resetForm: () => void;
  };
  onSuccess?: () => void;
}

export function useIncomeFormLogic({ actions, onSuccess }: UseIncomeFormLogicProps) {
  const { data: accounts, isLoading: loadingAccounts, refetchAccounts } = useAccounts();
  const createIncome = useCreateIncome();

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      accountId: '',
      amount: 0,
      isRecurring: false,
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const selectedAccountId = watch('accountId');
  const { data: allCategories } = useCategories(selectedAccountId);

  // Dados derivados
  const categories = allCategories?.filter((category) => category.type === 'income');
  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  // Auto-selecionar primeira conta
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('accountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedAccountId, setValue]);

  // Handlers
  const handleAmountChange = (value: string, valueAsNumber: number) => {
    actions.setAmountInputValue(value);
    setValue('amount', valueAsNumber, { shouldValidate: true });
  };

  const handleCategoryCreated = (newCategory: Category) => {
    if (newCategory.id) {
      setValue('categoryId', newCategory.id, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: IncomeFormData) => {
    actions.setButtonState('loading');

    try {
      const payload: CreateIncomeDTO = {
        ...data,
        amount: Number(data.amount),
      };

      const result = await createIncome.mutateAsync(payload);
      await refetchAccounts();

      const transactionData: CreatedTransactionData = {
        ...result,
        amount: Number(data.amount),
        description: data.description,
        accountName: selectedAccount?.account_name,
        categoryName: categories?.find(c => c.id === data.categoryId)?.name,
        formattedAmount: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Number(data.amount)),
      };

      actions.setCreatedTransaction(transactionData);
      actions.setButtonState('success');

      setTimeout(() => {
        actions.setShowConfirmationModal(true);
      }, 800);

      toast.success('Receita adicionada com sucesso!');

    } catch (error) {
      console.error('Error creating income:', error);
      toast.error('Erro ao adicionar receita');
      actions.setButtonState('idle');
    }
  };

  const handleConfirmationClose = () => {
    actions.setShowConfirmationModal(false);
    actions.setButtonState('idle');

    // Resetar formulário completamente
    setValue('amount', 0);
    actions.setAmountInputValue('');
    setValue('description', '');
    setValue('categoryId', '');
    setValue('dueDate', undefined);
    setValue('isRecurring', false);
    setValue('recurrencePattern', undefined);

    if (onSuccess) {
      setTimeout(() => onSuccess(), 300);
    }
  };

  const handleNewTransaction = () => {
    actions.setShowConfirmationModal(false);
    actions.resetForm();

    // Resetar formulário completamente
    setValue('amount', 0);
    actions.setAmountInputValue('');
    setValue('description', '');
    setValue('categoryId', '');
    setValue('dueDate', undefined);
    setValue('isRecurring', false);
    setValue('recurrencePattern', undefined);
  };

  return {
    // Form
    form: {
      register,
      handleSubmit: handleSubmit(onSubmit),
      errors,
      setValue,
      watch,
      reset: form.reset,
      formState: form.formState,
    },

    // Form functions exposed directly
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    setValue,
    watch,

    // Data
    accounts,
    categories,
    selectedAccount,
    selectedAccountId,
    loadingAccounts,
    createIncome,

    // Handlers
    handleAmountChange,
    handleCategoryCreated,
    handleConfirmationClose,
    handleNewTransaction,
  };
}

export { incomeSchema };
export type { IncomeFormData };