import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loanSimulationService } from '../services/loanSimulationService';
import type {
  LoanSimulationStatus,
  CreateLoanSimulationRequest
} from '../types/loanSimulation';
import { toast } from '../lib/toast';

export const LOAN_SIMULATIONS_QUERY_KEY = ['loan-simulations'];

export function useLoanSimulations(filters?: { status?: LoanSimulationStatus; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: [...LOAN_SIMULATIONS_QUERY_KEY, filters],
    queryFn: () => loanSimulationService.list(filters),
  });
}

export function useLoanSimulation(id: string | undefined) {
  return useQuery({
    queryKey: [...LOAN_SIMULATIONS_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error('ID da simulação não fornecido');
      return loanSimulationService.getById(id);
    },
    enabled: !!id,
  });
}

export function useCreateLoanSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLoanSimulationRequest) => loanSimulationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_SIMULATIONS_QUERY_KEY });
      toast.success('Simulação criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar simulação');
    },
  });
}

export function useApproveLoanSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loanSimulationService.approve(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LOAN_SIMULATIONS_QUERY_KEY });
      queryClient.setQueryData([...LOAN_SIMULATIONS_QUERY_KEY, data.id], data);
      toast.success('Simulação aprovada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao aprovar simulação');
    },
  });
}

export function useWithdrawLoanSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loanSimulationService.withdraw(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LOAN_SIMULATIONS_QUERY_KEY });
      queryClient.setQueryData([...LOAN_SIMULATIONS_QUERY_KEY, data.id], data);
      toast.success('Empréstimo sacado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao sacar empréstimo');
    },
  });
}

export function useDeleteLoanSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loanSimulationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_SIMULATIONS_QUERY_KEY });
      toast.success('Simulação excluída com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir simulação');
    },
  });
}
