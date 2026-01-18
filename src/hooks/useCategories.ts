import { useGetApiV1Categories, usePostApiV1Categories } from '@igorguariroba/bfin-sdk/react-query';
import { useCacheInvalidation } from './useCacheInvalidation';

export function useCategories(accountId?: string) {
  // A partir da versão 0.6.0 do SDK, o account_id é obrigatório
  return useGetApiV1Categories({ account_id: accountId });
}

export function useCreateCategory() {
  const { invalidateCategoryRelatedQueries } = useCacheInvalidation();

  return usePostApiV1Categories({
    mutation: {
      onSuccess: () => {
        invalidateCategoryRelatedQueries();
      }
    }
  });
}
