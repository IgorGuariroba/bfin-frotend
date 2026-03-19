import { useState } from 'react';
import {
  useApproveLoanSimulation,
  useWithdrawLoanSimulation,
  useDeleteLoanSimulation,
  useLoanSimulations,
} from './useLoanSimulations';
import { toast } from '../lib/toast';
import type { LoanSimulation } from '../types/loanSimulation';

export function useLoanSimulationActions() {
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const approveMutation = useApproveLoanSimulation();
  const withdrawMutation = useWithdrawLoanSimulation();
  const deleteMutation = useDeleteLoanSimulation();
  const { refetch: refetchSimulations } = useLoanSimulations();

  const handleViewSimulation = (simulation: LoanSimulation) => {
    setSelectedSimulationId(simulation.id);
    setIsDetailsOpen(true);
  };

  const handleApproveSimulation = async (simulation: LoanSimulation) => {
    try {
      await approveMutation.mutateAsync(simulation.id);
      await refetchSimulations();
      toast.success('Simulação aprovada com sucesso!');
    } catch (error) {
      console.error('Error approving simulation:', error);
      toast.error('Erro ao aprovar simulação. Tente novamente.');
    }
  };

  const handleWithdrawSimulation = async (simulation: LoanSimulation) => {
    try {
      await withdrawMutation.mutateAsync(simulation.id);
      await refetchSimulations();
      toast.success('Empréstimo sacado com sucesso!');
    } catch (error) {
      console.error('Error withdrawing simulation:', error);
      toast.error('Erro ao sacar empréstimo. Tente novamente.');
    }
  };

  const handleDeleteSimulation = async (simulation: LoanSimulation) => {
    if (confirm('Tem certeza que deseja excluir esta simulação?')) {
      try {
        await deleteMutation.mutateAsync(simulation.id);
        await refetchSimulations();
        toast.success('Simulação excluída com sucesso!');
      } catch (error) {
        console.error('Error deleting simulation:', error);
        toast.error('Erro ao excluir simulação. Tente novamente.');
      }
    }
  };

  return {
    state: {
      selectedSimulationId,
      isDetailsOpen,
    },
    actions: {
      setSelectedSimulationId,
      setIsDetailsOpen,
      handleViewSimulation,
      handleApproveSimulation,
      handleWithdrawSimulation,
      handleDeleteSimulation,
    },
    mutations: {
      approveMutation,
      withdrawMutation,
      deleteMutation,
    },
  };
}