import { useMemo } from 'react';

export interface DailyLimitData {
  dailyLimit: number;
  availableBalance: number;
  daysConsidered: number;
  spentToday: number;
  remaining: number;
  percentageUsed: number;
  exceeded: boolean;
  calculatedAt: string;
}

export interface DailyLimitCalculations {
  dailyLimit: number;
  availableBalance: number;
  daysConsidered: number;
  spentToday: number;
  remaining: number;
  percentageUsed: number;
  exceeded: boolean;
  calculatedAt: string;
  progressColor: string;
}

/**
 * Hook para gerenciar cálculos e estado do limite diário
 * @param limitData - Dados do limite diário da API
 * @returns Cálculos processados e cor do progresso
 */
export const useDailyLimitCalculations = (limitData?: DailyLimitData): DailyLimitCalculations => {
  return useMemo(() => {
    const dailyLimit = limitData?.dailyLimit || 0;
    const availableBalance = limitData?.availableBalance || 0;
    const daysConsidered = limitData?.daysConsidered || 0;
    const spentToday = limitData?.spentToday || 0;
    const remaining = limitData?.remaining || 0;
    const percentageUsed = limitData?.percentageUsed || 0;
    const exceeded = limitData?.exceeded || false;
    const calculatedAt = limitData?.calculatedAt || new Date().toISOString();

    // Determina a cor do progresso baseado no status
    const progressColor = exceeded ? '#ef4444' : 'var(--primary)';

    return {
      dailyLimit,
      availableBalance,
      daysConsidered,
      spentToday,
      remaining,
      percentageUsed,
      exceeded,
      calculatedAt,
      progressColor,
    };
  }, [limitData]);
};