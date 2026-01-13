import { useGetApiV1Categories } from '@igorguariroba/bfin-sdk/react-query';

export function useCategories() {
  // O SDK não suporta filtro por tipo ainda
  // TODO: Adicionar suporte a filtro por tipo no backend/SDK se necessário
  return useGetApiV1Categories();
}
