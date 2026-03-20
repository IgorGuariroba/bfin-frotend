import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createLoanSimulationSchema,
  type CreateLoanSimulationFormData,
} from '../types/loanSimulation';

export function useLoanFormState() {
  const [amountInputValue, setAmountInputValue] = useState<string>('500');

  // Form setup
  const form = useForm<CreateLoanSimulationFormData>({
    resolver: zodResolver(createLoanSimulationSchema),
    defaultValues: {
      amount: 500,
      termMonths: 12,
      interestRateMonthly: 2.5,
    },
  });

  // Watch form values for calculations
  const amount = form.watch('amount') || 0;
  const termMonths = form.watch('termMonths') || 12;
  const interestRateMonthly = form.watch('interestRateMonthly') || 2.5;

  // Calculations
  const calculateMonthlyPayment = () => {
    const rate = interestRateMonthly / 100;
    if (rate === 0) return amount / termMonths;
    const payment = (amount * rate) / (1 - Math.pow(1 + rate, -termMonths));
    return payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalAmount = monthlyPayment * termMonths;
  const totalInterest = totalAmount - amount;

  const handleAmountChange = (value: string) => {
    setAmountInputValue(value);
    const numericValue = value ? parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) : 0;
    form.setValue('amount', numericValue || 0, { shouldValidate: true });
  };

  return {
    form,
    state: {
      amountInputValue,
      amount,
      termMonths,
      interestRateMonthly,
      monthlyPayment,
      totalAmount,
      totalInterest,
    },
    actions: {
      handleAmountChange,
    },
  };
}