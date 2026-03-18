import { useMemo } from 'react';
import { useAccounts } from './useAccounts';

/**
 * Constantes para cálculos financeiros
 * Extrai magic numbers para configuração centralizada
 */
export const FINANCIAL_CONSTANTS = {
  EMERGENCY_RESERVE_PERCENTAGE: 0.3, // 30%
  SPENDING_PERCENTAGE: 0.7, // 70%
} as const;

/**
 * Interface para totais financeiros calculados
 */
interface FinancialTotals {
  emergencyReserve: number;
  totalBalance: number;
  availableForSpending: number;
}

/**
 * Hook para cálculos financeiros do Dashboard
 * Responsabilidade única: agregação e cálculo de dados financeiros
 * Benefícios: lógica de negócio isolada, reutilizável, testável
 */
export function useFinancialCalculations(): FinancialTotals & { isLoading: boolean } {
  const { data: accounts, isLoading } = useAccounts();

  const totals = useMemo((): FinancialTotals => {
    if (!accounts) {
      return {
        emergencyReserve: 0,
        totalBalance: 0,
        availableForSpending: 0,
      };
    }

    // Agregação de dados das contas
    const aggregated = accounts.reduce(
      (acc, account) => {
        const emergencyReserve = Number(account.emergency_reserve) || 0;
        const balance = Number(account.total_balance) || 0;

        return {
          emergencyReserve: acc.emergencyReserve + emergencyReserve,
          totalBalance: acc.totalBalance + balance,
        };
      },
      {
        emergencyReserve: 0,
        totalBalance: 0,
      }
    );

    // Cálculo do valor disponível para gastos
    const availableForSpending = aggregated.totalBalance - aggregated.emergencyReserve;

    return {
      ...aggregated,
      availableForSpending,
    };
  }, [accounts]);

  return {
    ...totals,
    isLoading,
  };
}

/**
 * Hook específico para informações da reserva de emergência
 * Abstrai a lógica específica para o dialog de reserva
 */
export function useEmergencyReserveInfo() {
  const { emergencyReserve, isLoading } = useFinancialCalculations();

  return {
    amount: emergencyReserve,
    percentage: FINANCIAL_CONSTANTS.EMERGENCY_RESERVE_PERCENTAGE,
    isLoading,
    description: 'Calculada automaticamente como 30% de todas as receitas recebidas',
  };
}