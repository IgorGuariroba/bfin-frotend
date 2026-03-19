import { useCreateLoanSimulation } from './useLoanSimulations';
import type { CreateLoanSimulationFormData } from '../types/loanSimulation';

interface UseLoanSimulationSubmissionProps {
  onSuccess?: () => void;
}

export function useLoanSimulationSubmission({
  onSuccess
}: UseLoanSimulationSubmissionProps) {
  const createMutation = useCreateLoanSimulation();

  const submitLoanSimulation = async (data: CreateLoanSimulationFormData) => {
    try {
      // Converter taxa de juros de porcentagem para decimal (ex: 2.5 -> 0.025)
      const submitData = {
        ...data,
        interestRateMonthly: data.interestRateMonthly / 100,
      };

      await createMutation.mutateAsync(submitData);
      onSuccess?.();
    } catch {
      // Erro já tratado no hook useCreateLoanSimulation
    }
  };

  return {
    submitLoanSimulation,
    isSubmitting: createMutation.isPending,
    error: createMutation.error,
    isError: createMutation.isError,
  };
}