import { useState } from 'react';
import { useCreateLoanSimulation, useLoanSimulations } from './useLoanSimulations';
import { toast } from '../lib/toast';
import type { CreateLoanSimulationFormData } from '../types/loanSimulation';

interface UseLoanFormSubmissionProps {
  onSuccess?: () => void;
  onFormReset?: () => void;
}

export function useLoanFormSubmission({ onSuccess, onFormReset }: UseLoanFormSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateLoanSimulation();
  const { refetch: refetchSimulations } = useLoanSimulations();

  const submitLoanSimulation = async (data: CreateLoanSimulationFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        interestRateMonthly: data.interestRateMonthly / 100,
      };

      await createMutation.mutateAsync(submitData);
      await refetchSimulations();

      if (onFormReset) {
        onFormReset();
      }

      toast.success('Simulação criada com sucesso!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating loan simulation:', error);
      toast.error('Erro ao criar simulação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitLoanSimulation,
    isSubmitting,
    error: createMutation.error,
    isError: createMutation.isError,
  };
}