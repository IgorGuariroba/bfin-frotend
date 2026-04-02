import { useQuery } from '@tanstack/react-query';
import { cashflowService } from '../services/cashflowService';
import type { MonthlyCashFlowParams } from '../types/cashflow';

export function useMonthlyCashFlow(params: MonthlyCashFlowParams) {
  return useQuery({
    queryKey: ['cash-flow', 'monthly', params],
    queryFn: () => cashflowService.getMonthlyProjection(params),
    enabled: !!params.accountId, // só executa se tiver accountId
    staleTime: 1000 * 60 * 5, // considera dados frescos por 5 minutos
  });
}