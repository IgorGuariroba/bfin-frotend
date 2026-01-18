import { useGetApiV1Categories, usePostApiV1Categories } from '@igorguariroba/bfin-sdk/react-query';
import { useQueryClient } from '@tanstack/react-query';

export function useCategories(accountId?: string) {
  // A partir da versão 0.6.0 do SDK, o account_id é obrigatório
  return useGetApiV1Categories({ account_id: accountId });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return usePostApiV1Categories({
    mutation: {
      onSuccess: () => {
        // Invalida todas as queries relacionadas a categorias
        // O SDK do React Query geralmente usa chaves como ['api', 'v1', 'categories'] ou ['getApiV1Categories']
        // Usamos predicate para invalidar qualquer query que contenha 'categories' na chave
        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey;
            // Verifica se a chave contém 'categories' (case insensitive)
            const keyString = Array.isArray(key)
              ? key.map(String).join(' ').toLowerCase()
              : String(key).toLowerCase();
            return keyString.includes('categories') || keyString.includes('category');
          }
        });
      }
    }
  });
}
