import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createLoanSimulationSchema,
  type CreateLoanSimulationFormData,
  LOAN_SIMULATION_CONSTANTS
} from '../types/loanSimulation';

interface UseLoanSimulationFormStateProps {
  initialData?: Partial<CreateLoanSimulationFormData>;
}

export function useLoanSimulationFormState({
  initialData
}: UseLoanSimulationFormStateProps = {}) {
  const [amountInputValue, setAmountInputValue] = useState('');

  const form = useForm<CreateLoanSimulationFormData>({
    resolver: zodResolver(createLoanSimulationSchema),
    defaultValues: initialData || {
      amount: 1000,
      termMonths: 12,
      interestRateMonthly: 2.5,
    },
  });

  const amount = form.watch('amount') || 0;

  const handleAmountChange = (value: string) => {
    setAmountInputValue(value);
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    form.setValue('amount', numericValue, { shouldValidate: true });
  };

  return {
    form,
    state: {
      amountInputValue,
      amount,
    },
    actions: {
      handleAmountChange,
    },
    constants: LOAN_SIMULATION_CONSTANTS,
  };
}