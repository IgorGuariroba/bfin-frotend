# React Query Patterns for Loan Simulations

Este documento define os padrões específicos de React Query para o sistema de simulação de empréstimos, seguindo as práticas estabelecidas no projeto BFIN Frontend.

## Sumário

1. [Arquitetura Geral](#arquitetura-geral)
2. [Custom Hooks Pattern](#custom-hooks-pattern)
3. [Query Key Strategies](#query-key-strategies)
4. [Mutation Patterns](#mutation-patterns)
5. [Error Handling](#error-handling)
6. [Optimistic Updates](#optimistic-updates)
7. [Cache Invalidation](#cache-invalidation)
8. [Integration com BFIN SDK](#integration-com-bfin-sdk)

---

## Arquitetura Geral

### Service Layer Pattern

Seguindo o padrão estabelecido no projeto, criamos um service layer para abstrair as chamadas do SDK:

```typescript
// src/services/loanSimulationService.ts
import { customInstance } from '@igorguariroba/bfin-sdk';
import type {
  LoanSimulation,
  CreateLoanSimulationDTO,
  ApproveLoanSimulationDTO,
  WithdrawLoanSimulationDTO,
  ListLoanSimulationsParams,
  LoanSimulationListResponse,
} from '../types/loanSimulation';

export const loanSimulationService = {
  /**
   * Create new loan simulation
   */
  async create(data: CreateLoanSimulationDTO): Promise<{ simulation: LoanSimulation; message: string }> {
    return customInstance({
      url: '/api/v1/loan-simulations',
      method: 'POST',
      data,
    });
  },

  /**
   * List loan simulations with filters
   */
  async list(params?: ListLoanSimulationsParams): Promise<LoanSimulationListResponse> {
    return customInstance({
      url: '/api/v1/loan-simulations',
      method: 'GET',
      params,
    });
  },

  /**
   * Get loan simulation details by ID
   */
  async getById(id: string): Promise<LoanSimulation> {
    return customInstance({
      url: `/api/v1/loan-simulations/${id}`,
      method: 'GET',
    });
  },

  /**
   * Approve loan simulation
   */
  async approve(id: string, data?: ApproveLoanSimulationDTO): Promise<{ simulation: LoanSimulation; message: string }> {
    return customInstance({
      url: `/api/v1/loan-simulations/${id}/approve`,
      method: 'POST',
      data,
    });
  },

  /**
   * Withdraw funds from approved simulation
   */
  async withdraw(id: string, data: WithdrawLoanSimulationDTO): Promise<{ simulation: LoanSimulation; message: string }> {
    return customInstance({
      url: `/api/v1/loan-simulations/${id}/withdraw`,
      method: 'POST',
      data,
    });
  },

  /**
   * Delete loan simulation
   */
  async delete(id: string): Promise<{ message: string }> {
    return customInstance({
      url: `/api/v1/loan-simulations/${id}`,
      method: 'DELETE',
    });
  },
};
```

---

## Custom Hooks Pattern

### 1. useLoanSimulations (Lista de Simulações)

```typescript
// src/hooks/useLoanSimulations.ts
import { useQuery } from '@tanstack/react-query';
import { loanSimulationService } from '../services/loanSimulationService';
import type { ListLoanSimulationsParams } from '../types/loanSimulation';

export function useLoanSimulations(params?: ListLoanSimulationsParams) {
  return useQuery({
    queryKey: ['loan-simulations', params],
    queryFn: () => loanSimulationService.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - dados financeiros precisam de atualização regular
    select: (data) => ({
      simulations: data.simulations || [],
      pagination: data.pagination,
    }),
  });
}

// Hook específico para simulações por status
export function useLoanSimulationsByStatus(status?: 'pending' | 'approved' | 'completed') {
  return useLoanSimulations(status ? { status } : undefined);
}

// Hook para simulações pendentes (mais usadas)
export function usePendingLoanSimulations() {
  return useQuery({
    queryKey: ['loan-simulations', { status: 'pending' }],
    queryFn: () => loanSimulationService.list({ status: 'pending' }),
    staleTime: 2 * 60 * 1000, // 2 minutes - simulações pendentes mudam frequentemente
    select: (data) => data.simulations || [],
  });
}
```

### 2. useLoanSimulationDetails (Detalhes Específicos)

```typescript
// src/hooks/useLoanSimulationDetails.ts
import { useQuery } from '@tanstack/react-query';
import { loanSimulationService } from '../services/loanSimulationService';

export function useLoanSimulationDetails(id: string) {
  return useQuery({
    queryKey: ['loan-simulation', id],
    queryFn: () => loanSimulationService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes - detalhes mudam menos frequentemente
    select: (data) => ({
      ...data,
      // Calcular dados derivados
      isExpired: data.expires_at ? new Date(data.expires_at) < new Date() : false,
      daysUntilExpiration: data.expires_at
        ? Math.ceil((new Date(data.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
      canBeApproved: data.status === 'pending' &&
                     (!data.expires_at || new Date(data.expires_at) > new Date()),
      canBeWithdrawn: data.status === 'approved',
    }),
  });
}
```

### 3. useEmergencyReserve (Dados da Reserva)

```typescript
// src/hooks/useEmergencyReserve.ts
import { useQuery } from '@tanstack/react-query';
import { customInstance } from '@igorguariroba/bfin-sdk';

interface EmergencyReserveData {
  total_reserve: number;
  available_for_loan: number; // 70% da reserva
  current_loans_amount: number;
  remaining_loan_capacity: number;
}

export function useEmergencyReserve(accountId?: string) {
  return useQuery({
    queryKey: ['emergency-reserve', accountId],
    queryFn: async (): Promise<EmergencyReserveData> => {
      return customInstance({
        url: '/api/v1/accounts/emergency-reserve',
        method: 'GET',
        params: accountId ? { accountId } : {},
      });
    },
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => ({
      ...data,
      // Cálculos úteis para validação
      loanLimitPercentage: (data.available_for_loan / data.total_reserve) * 100,
      hasCapacityForLoan: data.remaining_loan_capacity > 0,
    }),
  });
}
```

---

## Query Key Strategies

### Padrão Hierárquico

```typescript
// src/hooks/queryKeys.ts
export const loanSimulationKeys = {
  // Base key
  all: ['loan-simulations'] as const,

  // Lists
  lists: () => [...loanSimulationKeys.all, 'list'] as const,
  list: (params?: ListLoanSimulationsParams) =>
    [...loanSimulationKeys.lists(), params] as const,

  // Status-specific lists (cache optimization)
  byStatus: (status: string) =>
    [...loanSimulationKeys.lists(), { status }] as const,

  // Details
  details: () => [...loanSimulationKeys.all, 'detail'] as const,
  detail: (id: string) => [...loanSimulationKeys.details(), id] as const,

  // Related data
  emergencyReserve: (accountId?: string) =>
    ['emergency-reserve', accountId] as const,
} as const;

// Uso nos hooks
export function useLoanSimulations(params?: ListLoanSimulationsParams) {
  return useQuery({
    queryKey: loanSimulationKeys.list(params),
    queryFn: () => loanSimulationService.list(params),
  });
}

export function useLoanSimulationDetails(id: string) {
  return useQuery({
    queryKey: loanSimulationKeys.detail(id),
    queryFn: () => loanSimulationService.getById(id),
    enabled: !!id,
  });
}
```

---

## Mutation Patterns

### 1. useCreateLoanSimulation (Criação com Optimistic Update)

```typescript
// src/hooks/useLoanSimulationMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loanSimulationService } from '../services/loanSimulationService';
import { useLoanSimulationCacheInvalidation } from './useLoanSimulationCacheInvalidation';
import { toaster } from '../components/ui/toaster';
import { loanSimulationKeys } from './queryKeys';
import type {
  CreateLoanSimulationDTO,
  LoanSimulation,
  LoanSimulationListResponse
} from '../types/loanSimulation';

export function useCreateLoanSimulation() {
  const queryClient = useQueryClient();
  const { invalidateLoanSimulationRelatedQueries } = useLoanSimulationCacheInvalidation();

  return useMutation({
    mutationFn: (data: CreateLoanSimulationDTO) => loanSimulationService.create(data),

    onMutate: async (newSimulationData) => {
      // Cancelar refetches em andamento
      await queryClient.cancelQueries({
        queryKey: loanSimulationKeys.lists()
      });

      // Snapshot dos dados anteriores
      const previousSimulations = queryClient.getQueryData<LoanSimulationListResponse>(
        loanSimulationKeys.list()
      );

      // Optimistic update - criar simulação temporária
      const optimisticSimulation: LoanSimulation = {
        id: `temp-${Date.now()}`,
        ...newSimulationData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        // Valores calculados temporários
        monthly_payment: 0,
        total_payment: 0,
        total_interest: 0,
        installments: [],
      };

      // Atualizar cache com simulação otimística
      if (previousSimulations) {
        queryClient.setQueryData<LoanSimulationListResponse>(
          loanSimulationKeys.list(),
          {
            ...previousSimulations,
            simulations: [optimisticSimulation, ...previousSimulations.simulations],
          }
        );
      }

      // Retornar contexto para rollback
      return {
        previousSimulations,
        optimisticSimulation,
      };
    },

    onSuccess: (response, variables, context) => {
      // Substituir simulação otimística pela real
      if (context?.previousSimulations && context?.optimisticSimulation) {
        queryClient.setQueryData<LoanSimulationListResponse>(
          loanSimulationKeys.list(),
          (old) => {
            if (!old) return old;

            return {
              ...old,
              simulations: old.simulations.map(sim =>
                sim.id === context.optimisticSimulation.id
                  ? response.simulation
                  : sim
              ),
            };
          }
        );
      }

      toaster.create({
        title: 'Simulação criada com sucesso!',
        description: response.message,
        type: 'success',
      });
    },

    onError: (error, variables, context) => {
      // Rollback em caso de erro
      if (context?.previousSimulations) {
        queryClient.setQueryData(
          loanSimulationKeys.list(),
          context.previousSimulations
        );
      }

      toaster.create({
        title: 'Erro ao criar simulação',
        description: error.message || 'Tente novamente em alguns instantes.',
        type: 'error',
      });
    },

    onSettled: () => {
      // Invalidar queries relacionadas independente de sucesso/erro
      invalidateLoanSimulationRelatedQueries();
    },
  });
}
```

### 2. useApproveLoanSimulation (Aprovação)

```typescript
export function useApproveLoanSimulation() {
  const queryClient = useQueryClient();
  const { invalidateLoanSimulationRelatedQueries } = useLoanSimulationCacheInvalidation();

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data?: ApproveLoanSimulationDTO
    }) => loanSimulationService.approve(id, data),

    onMutate: async ({ id }) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({
        queryKey: loanSimulationKeys.detail(id)
      });

      // Snapshot do estado anterior
      const previousSimulation = queryClient.getQueryData<LoanSimulation>(
        loanSimulationKeys.detail(id)
      );

      // Optimistic update - mudar status para approved
      if (previousSimulation) {
        queryClient.setQueryData<LoanSimulation>(
          loanSimulationKeys.detail(id),
          {
            ...previousSimulation,
            status: 'approved',
            updated_at: new Date().toISOString(),
          }
        );

        // Atualizar também na lista
        queryClient.setQueryData<LoanSimulationListResponse>(
          loanSimulationKeys.list(),
          (old) => {
            if (!old) return old;

            return {
              ...old,
              simulations: old.simulations.map(sim =>
                sim.id === id
                  ? { ...sim, status: 'approved' as const, updated_at: new Date().toISOString() }
                  : sim
              ),
            };
          }
        );
      }

      return { previousSimulation };
    },

    onSuccess: (response, { id }, context) => {
      // Atualizar com dados reais do servidor
      queryClient.setQueryData(
        loanSimulationKeys.detail(id),
        response.simulation
      );

      toaster.create({
        title: 'Simulação aprovada!',
        description: response.message,
        type: 'success',
      });
    },

    onError: (error, { id }, context) => {
      // Rollback
      if (context?.previousSimulation) {
        queryClient.setQueryData(
          loanSimulationKeys.detail(id),
          context.previousSimulation
        );
      }

      toaster.create({
        title: 'Erro ao aprovar simulação',
        description: error.message || 'Verifique se a simulação ainda está válida.',
        type: 'error',
      });
    },

    onSettled: () => {
      invalidateLoanSimulationRelatedQueries();
    },
  });
}
```

### 3. useWithdrawLoanSimulation (Saque)

```typescript
export function useWithdrawLoanSimulation() {
  const queryClient = useQueryClient();
  const { invalidateLoanSimulationRelatedQueries, invalidateAccountRelatedQueries } = useLoanSimulationCacheInvalidation();

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: WithdrawLoanSimulationDTO
    }) => loanSimulationService.withdraw(id, data),

    onMutate: async ({ id }) => {
      // Cancelar queries relacionadas
      await Promise.all([
        queryClient.cancelQueries({ queryKey: loanSimulationKeys.detail(id) }),
        queryClient.cancelQueries({ queryKey: ['accounts'] }),
      ]);

      // Snapshot do estado anterior
      const previousSimulation = queryClient.getQueryData<LoanSimulation>(
        loanSimulationKeys.detail(id)
      );

      // Optimistic update - mudar status para completed
      if (previousSimulation) {
        queryClient.setQueryData<LoanSimulation>(
          loanSimulationKeys.detail(id),
          {
            ...previousSimulation,
            status: 'completed',
            withdrawn_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        );
      }

      return { previousSimulation };
    },

    onSuccess: (response, { id }) => {
      // Atualizar com dados reais
      queryClient.setQueryData(
        loanSimulationKeys.detail(id),
        response.simulation
      );

      toaster.create({
        title: 'Saque realizado com sucesso!',
        description: 'Os fundos foram transferidos para sua conta.',
        type: 'success',
      });
    },

    onError: (error, { id }, context) => {
      // Rollback
      if (context?.previousSimulation) {
        queryClient.setQueryData(
          loanSimulationKeys.detail(id),
          context.previousSimulation
        );
      }

      toaster.create({
        title: 'Erro ao realizar saque',
        description: error.message || 'Verifique seus dados bancários.',
        type: 'error',
      });
    },

    onSettled: () => {
      // Invalidar tanto simulações quanto contas (saldo foi alterado)
      Promise.all([
        invalidateLoanSimulationRelatedQueries(),
        invalidateAccountRelatedQueries(),
      ]);
    },
  });
}

// Hook composto para facilitar uso
export function useLoanSimulationActions() {
  return {
    create: useCreateLoanSimulation(),
    approve: useApproveLoanSimulation(),
    withdraw: useWithdrawLoanSimulation(),
  };
}
```

---

## Error Handling

### Error Types e Handling Específico

```typescript
// src/types/loanSimulationErrors.ts
export interface LoanSimulationError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type LoanSimulationErrorCode =
  | 'INSUFFICIENT_RESERVE'
  | 'SIMULATION_EXPIRED'
  | 'INVALID_INTEREST_RATE'
  | 'ALREADY_APPROVED'
  | 'INVALID_BANK_DATA'
  | 'LOAN_LIMIT_EXCEEDED';

// src/hooks/useLoanSimulationErrorHandler.ts
import { useCallback } from 'react';
import { toaster } from '../components/ui/toaster';
import type { LoanSimulationError, LoanSimulationErrorCode } from '../types/loanSimulationErrors';

const errorMessages: Record<LoanSimulationErrorCode, string> = {
  INSUFFICIENT_RESERVE: 'Reserva de emergência insuficiente para o valor solicitado.',
  SIMULATION_EXPIRED: 'Esta simulação expirou. Crie uma nova simulação.',
  INVALID_INTEREST_RATE: 'Taxa de juros informada está fora dos limites permitidos.',
  ALREADY_APPROVED: 'Esta simulação já foi aprovada.',
  INVALID_BANK_DATA: 'Dados bancários inválidos. Verifique as informações.',
  LOAN_LIMIT_EXCEEDED: 'Valor solicitado excede o limite de 70% da reserva.',
};

export function useLoanSimulationErrorHandler() {
  const handleError = useCallback((error: unknown) => {
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    let errorTitle = 'Erro';

    if (error && typeof error === 'object' && 'code' in error) {
      const loanError = error as LoanSimulationError;

      if (loanError.code in errorMessages) {
        errorMessage = errorMessages[loanError.code as LoanSimulationErrorCode];
        errorTitle = 'Erro na Simulação';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toaster.create({
      title: errorTitle,
      description: errorMessage,
      type: 'error',
      placement: 'top-end',
    });
  }, []);

  return { handleError };
}

// Uso nas mutations
export function useCreateLoanSimulation() {
  const { handleError } = useLoanSimulationErrorHandler();
  // ... resto do código

  return useMutation({
    // ...
    onError: (error, variables, context) => {
      // Rollback logic...

      // Error handling específico
      handleError(error);
    },
  });
}
```

---

## Optimistic Updates

### Padrões Avançados de Optimistic Updates

```typescript
// src/hooks/useOptimisticLoanSimulation.ts
import { useQueryClient } from '@tanstack/react-query';
import { loanSimulationKeys } from './queryKeys';
import type { LoanSimulation } from '../types/loanSimulation';

export function useOptimisticLoanSimulation() {
  const queryClient = useQueryClient();

  // Utility para criar simulação otimística
  const createOptimisticSimulation = (data: Partial<LoanSimulation>): LoanSimulation => ({
    id: `optimistic-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    // Default values
    monthly_payment: 0,
    total_payment: 0,
    total_interest: 0,
    installments: [],
    ...data,
  });

  // Adicionar simulação otimística à lista
  const addOptimisticSimulation = (simulation: LoanSimulation) => {
    queryClient.setQueryData(
      loanSimulationKeys.list(),
      (old: any) => {
        if (!old) return { simulations: [simulation], pagination: { total: 1 } };

        return {
          ...old,
          simulations: [simulation, ...old.simulations],
        };
      }
    );
  };

  // Atualizar simulação específica otimisticamente
  const updateOptimisticSimulation = (id: string, updates: Partial<LoanSimulation>) => {
    // Atualizar detalhes
    queryClient.setQueryData(
      loanSimulationKeys.detail(id),
      (old: LoanSimulation | undefined) => old ? { ...old, ...updates } : undefined
    );

    // Atualizar na lista
    queryClient.setQueryData(
      loanSimulationKeys.list(),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          simulations: old.simulations.map((sim: LoanSimulation) =>
            sim.id === id ? { ...sim, ...updates } : sim
          ),
        };
      }
    );
  };

  // Remover simulação otimística
  const removeOptimisticSimulation = (id: string) => {
    queryClient.setQueryData(
      loanSimulationKeys.list(),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          simulations: old.simulations.filter((sim: LoanSimulation) => sim.id !== id),
        };
      }
    );

    // Remover dos detalhes também
    queryClient.removeQueries({ queryKey: loanSimulationKeys.detail(id) });
  };

  return {
    createOptimisticSimulation,
    addOptimisticSimulation,
    updateOptimisticSimulation,
    removeOptimisticSimulation,
  };
}
```

---

## Cache Invalidation

### Sistema Centralizado de Invalidação

```typescript
// src/hooks/useLoanSimulationCacheInvalidation.ts
import { useQueryClient } from '@tanstack/react-query';
import { useCacheInvalidation } from './useCacheInvalidation'; // Hook existente do projeto

export function useLoanSimulationCacheInvalidation() {
  const queryClient = useQueryClient();
  const {
    invalidateAccountRelatedQueries,
    invalidateTransactionRelatedQueries
  } = useCacheInvalidation();

  /**
   * Invalidar todas as queries relacionadas a simulações de empréstimo
   */
  const invalidateLoanSimulationRelatedQueries = () => {
    // Queries específicas de loan simulations
    queryClient.invalidateQueries({
      queryKey: ['loan-simulations']
    });

    // Queries da reserva de emergência
    queryClient.invalidateQueries({
      queryKey: ['emergency-reserve']
    });

    // Invalidação robusta usando predicate (similar ao padrão existente)
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        if (!Array.isArray(key)) return false;

        const keyString = key.map(k => String(k).toLowerCase()).join('|');

        const loanPatterns = [
          'loan-simulations',
          'loan-simulation',
          'emergency-reserve',
          'loan',
          'simulation'
        ];

        return loanPatterns.some(pattern => keyString.includes(pattern));
      }
    });
  };

  /**
   * Invalidar queries quando saldo de conta é afetado (após saque)
   */
  const invalidateAfterWithdraw = () => {
    // Invalidar simulações
    invalidateLoanSimulationRelatedQueries();

    // Invalidar contas (saldo foi alterado)
    invalidateAccountRelatedQueries();

    // Invalidar transações (pode ter criado nova transação)
    invalidateTransactionRelatedQueries();
  };

  /**
   * Invalidar apenas dados específicos (performance)
   */
  const invalidateSimulationDetails = (id: string) => {
    queryClient.invalidateQueries({
      queryKey: ['loan-simulation', id]
    });
  };

  /**
   * Refetch forçado de dados críticos
   */
  const refetchCriticalData = async () => {
    try {
      const refetchPromises = [
        // Simulações ativas
        queryClient.refetchQueries({
          queryKey: ['loan-simulations'],
          type: 'active'
        }),

        // Reserva de emergência
        queryClient.refetchQueries({
          queryKey: ['emergency-reserve'],
          type: 'active'
        }),
      ];

      await Promise.all(refetchPromises);
    } catch (error) {
      console.error('Erro durante refetch de dados críticos:', error);
      throw error;
    }
  };

  return {
    invalidateLoanSimulationRelatedQueries,
    invalidateAfterWithdraw,
    invalidateSimulationDetails,
    refetchCriticalData,
  };
}
```

---

## Integration com BFIN SDK

### Padrões de Integração com SDK Existente

```typescript
// src/hooks/useLoanSimulationSDK.ts
import {
  useGetApiV1LoanSimulations,
  usePostApiV1LoanSimulations,
  // Assumindo que estes hooks existirão no SDK
} from '@igorguariroba/bfin-sdk/react-query';
import { useCacheInvalidation } from './useCacheInvalidation';

/**
 * Hook que usa diretamente os hooks gerados pelo SDK
 * Mantém consistência com useAccounts.ts
 */
export function useLoanSimulationsSDK() {
  const query = useGetApiV1LoanSimulations();

  // Expor função de refetch para uso manual (padrão do projeto)
  const refetchLoanSimulations = () => {
    return query.refetch();
  };

  return {
    ...query,
    refetchLoanSimulations,
    // Alias para manter compatibilidade
    simulations: query.data?.simulations || [],
    pagination: query.data?.pagination,
  };
}

/**
 * Hook híbrido que combina SDK com custom logic
 */
export function useLoanSimulations(params?: ListLoanSimulationsParams) {
  // Se não há parâmetros, usar hook do SDK
  const sdkQuery = useGetApiV1LoanSimulations({
    query: { enabled: !params }
  });

  // Se há parâmetros, usar service customizado
  const customQuery = useQuery({
    queryKey: ['loan-simulations', params],
    queryFn: () => loanSimulationService.list(params),
    enabled: !!params,
  });

  // Retornar query apropriada
  const activeQuery = params ? customQuery : sdkQuery;

  return {
    ...activeQuery,
    simulations: activeQuery.data?.simulations || [],
    pagination: activeQuery.data?.pagination,
    refetch: activeQuery.refetch,
  };
}

/**
 * Mutations usando SDK quando disponível
 */
export function useCreateLoanSimulationSDK() {
  const { invalidateLoanSimulationRelatedQueries } = useLoanSimulationCacheInvalidation();

  // Usar mutation do SDK se disponível, senão usar service customizado
  const mutation = usePostApiV1LoanSimulations?.({
    mutation: {
      onSuccess: () => {
        invalidateLoanSimulationRelatedQueries();

        toaster.create({
          title: 'Simulação criada!',
          type: 'success',
        });
      },
      onError: (error) => {
        toaster.create({
          title: 'Erro ao criar simulação',
          description: error.message,
          type: 'error',
        });
      },
    },
  }) || useMutation({
    mutationFn: loanSimulationService.create,
    onSuccess: () => {
      invalidateLoanSimulationRelatedQueries();

      toaster.create({
        title: 'Simulação criada!',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Erro ao criar simulação',
        description: error.message,
        type: 'error',
      });
    },
  });

  return mutation;
}
```

---

## Patterns de Loading e Error States

### Estados de Loading Compostos

```typescript
// src/hooks/useLoanSimulationStates.ts
export function useLoanSimulationStates() {
  const simulationsQuery = useLoanSimulations();
  const emergencyReserveQuery = useEmergencyReserve();

  // Estados compostos
  const isInitialLoading = simulationsQuery.isLoading || emergencyReserveQuery.isLoading;
  const isRefetching = simulationsQuery.isFetching && !simulationsQuery.isLoading;
  const hasError = simulationsQuery.isError || emergencyReserveQuery.isError;

  // Estados específicos da feature
  const isReadyToCreateSimulation = !isInitialLoading &&
                                   !hasError &&
                                   emergencyReserveQuery.data?.hasCapacityForLoan;

  return {
    isInitialLoading,
    isRefetching,
    hasError,
    isReadyToCreateSimulation,

    // Dados individuais
    simulations: simulationsQuery.data?.simulations || [],
    emergencyReserve: emergencyReserveQuery.data,

    // Error details
    simulationsError: simulationsQuery.error,
    reserveError: emergencyReserveQuery.error,

    // Refetch functions
    refetchAll: () => Promise.all([
      simulationsQuery.refetch(),
      emergencyReserveQuery.refetch(),
    ]),
  };
}
```

---

## Exemplo de Uso Completo

### Hook Composto para Página de Simulações

```typescript
// src/hooks/useLoanSimulationPage.ts
export function useLoanSimulationPage() {
  // Queries
  const {
    simulations,
    emergencyReserve,
    isInitialLoading,
    hasError,
    refetchAll
  } = useLoanSimulationStates();

  // Mutations
  const { create, approve, withdraw } = useLoanSimulationActions();

  // Estados derivados
  const hasSimulations = simulations.length > 0;
  const pendingSimulations = simulations.filter(s => s.status === 'pending');
  const approvedSimulations = simulations.filter(s => s.status === 'approved');

  // Handlers
  const handleCreateSimulation = useCallback(async (data: CreateLoanSimulationDTO) => {
    try {
      await create.mutateAsync(data);
      // Success é tratado na mutation
    } catch (error) {
      // Error é tratado na mutation
      throw error;
    }
  }, [create]);

  const handleApproveSimulation = useCallback(async (id: string) => {
    try {
      await approve.mutateAsync({ id });
    } catch (error) {
      throw error;
    }
  }, [approve]);

  const handleWithdrawSimulation = useCallback(async (id: string, bankData: WithdrawLoanSimulationDTO) => {
    try {
      await withdraw.mutateAsync({ id, data: bankData });
    } catch (error) {
      throw error;
    }
  }, [withdraw]);

  return {
    // Data
    simulations,
    pendingSimulations,
    approvedSimulations,
    emergencyReserve,

    // States
    isInitialLoading,
    hasError,
    hasSimulations,

    // Actions
    createSimulation: handleCreateSimulation,
    approveSimulation: handleApproveSimulation,
    withdrawSimulation: handleWithdrawSimulation,

    // Mutation states
    isCreating: create.isPending,
    isApproving: approve.isPending,
    isWithdrawing: withdraw.isPending,

    // Utils
    refetchAll,
  };
}
```

---

## Resumo dos Padrões

### ✅ Padrões Obrigatórios

1. **Service Layer**: Sempre abstrair SDK calls através de services
2. **Query Keys Hierárquicos**: Usar padrão estruturado para keys
3. **Custom Hooks**: Encapsular lógica de negócio em hooks específicos
4. **Cache Invalidation Centralizada**: Usar hook específico para invalidations
5. **Error Handling Tipado**: Definir tipos específicos para erros da feature
6. **Optimistic Updates**: Implementar para melhor UX em operations críticas
7. **Toast Notifications**: Feedback consistente usando toaster do projeto
8. **TypeScript Strict**: Tipos completos para todos os dados e mutations

### 🎯 Benefícios

- **Consistência**: Mantém padrões estabelecidos no projeto
- **Performance**: Optimistic updates e cache inteligente
- **UX**: Feedback imediato e estados de loading adequados
- **Manutenibilidade**: Lógica centralizada e tipagem completa
- **Testabilidade**: Hooks isolados e lógica bem definida

### 📚 Referências

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Projeto BFIN - useTransactions.ts](/src/hooks/useTransactions.ts)
- [Projeto BFIN - useCacheInvalidation.ts](/src/hooks/useCacheInvalidation.ts)
- [CLAUDE.md - Seção React Query](/CLAUDE.md#5-react-query)