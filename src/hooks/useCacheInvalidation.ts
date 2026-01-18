import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook centralizado para gerenciar invalidações de cache do React Query
 * Garante que todas as queries relacionadas sejam invalidadas corretamente
 * após mutations que afetam os dados.
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  /**
   * Invalida todas as queries relacionadas a transações financeiras
   * Deve ser chamado após criar, editar ou deletar transações
   */
  const invalidateTransactionRelatedQueries = () => {
    // Queries de transações
    queryClient.invalidateQueries({ queryKey: ['transactions'] });

    // Invalidação robusta para accounts do SDK
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        if (!Array.isArray(key)) return false;

        // Converte toda a key para string e procura por padrões relacionados a accounts
        const keyString = key.map(k => String(k).toLowerCase()).join('|');

        const accountPatterns = [
          'accounts',
          'api/v1/accounts',
          'getapiv1accounts',
          'account',
          '/accounts',
          'v1/accounts'
        ];

        return accountPatterns.some(pattern => keyString.includes(pattern));
      }
    });

    // Queries tradicionais de accounts (compatibilidade)
    queryClient.invalidateQueries({ queryKey: ['accounts'] });

    // Queries de limites diários
    queryClient.invalidateQueries({ queryKey: ['daily-limit'] });
    queryClient.invalidateQueries({ queryKey: ['daily-limit-status'] });
    queryClient.invalidateQueries({ queryKey: ['total-daily-limit'] });

    // Queries de histórico de gastos
    queryClient.invalidateQueries({ queryKey: ['spending-history'] });

    // Queries de categorias (podem ter saldos afetados)
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  /**
   * Invalida queries relacionadas a contas bancárias
   * Deve ser chamado após criar, editar ou deletar contas
   */
  const invalidateAccountRelatedQueries = () => {
    // Accounts do SDK
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          (key.includes('accounts') || key.includes('api/v1/accounts'))
        );
      }
    });

    // Queries tradicionais
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    queryClient.invalidateQueries({ queryKey: ['account-members'] });
    queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
  };

  /**
   * Invalida queries relacionadas a categorias
   * Deve ser chamado após criar, editar ou deletar categorias
   */
  const invalidateCategoryRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    // Transações também podem ser afetadas por mudanças em categorias
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  /**
   * Invalida queries relacionadas a limites diários
   * Deve ser chamado após alterar configurações de limite
   */
  const invalidateDailyLimitRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['daily-limit'] });
    queryClient.invalidateQueries({ queryKey: ['daily-limit-status'] });
    queryClient.invalidateQueries({ queryKey: ['total-daily-limit'] });
    queryClient.invalidateQueries({ queryKey: ['spending-history'] });
  };

  /**
   * Invalida todas as queries (útil para refresh geral)
   * Use com moderação - apenas em casos específicos
   */
  const invalidateAllQueries = () => {
    queryClient.invalidateQueries();
  };

  /**
   * Refetch específico para dados de contas (forçar atualização imediata)
   * Útil quando você quer garantir que os dados mais recentes sejam mostrados
   */
  const refetchAccountData = async () => {
    try {
      // Primeiro, invalida todas as queries de accounts
      const invalidatePromises = [
        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey;
            if (!Array.isArray(key)) return false;

            const keyString = key.map(k => String(k).toLowerCase()).join('|');
            const accountPatterns = [
              'accounts',
              'api/v1/accounts',
              'getapiv1accounts',
              'account',
              '/accounts',
              'v1/accounts'
            ];

            return accountPatterns.some(pattern => keyString.includes(pattern));
          }
        }),
        queryClient.invalidateQueries({ queryKey: ['accounts'] })
      ];

      await Promise.all(invalidatePromises);

      // Depois força o refetch
      const refetchPromises = [
        queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey;
            if (!Array.isArray(key)) return false;

            const keyString = key.map(k => String(k).toLowerCase()).join('|');
            const accountPatterns = [
              'accounts',
              'api/v1/accounts',
              'getapiv1accounts',
              'account',
              '/accounts',
              'v1/accounts'
            ];

            return accountPatterns.some(pattern => keyString.includes(pattern));
          },
          type: 'active' // Apenas queries ativas
        }),
        queryClient.refetchQueries({ queryKey: ['accounts'], type: 'active' })
      ];

      await Promise.all(refetchPromises);

    } catch (error) {
      console.error('Erro durante refetch de accounts:', error);
      throw error;
    }
  };

  return {
    invalidateTransactionRelatedQueries,
    invalidateAccountRelatedQueries,
    invalidateCategoryRelatedQueries,
    invalidateDailyLimitRelatedQueries,
    invalidateAllQueries,
    refetchAccountData,
  };
}