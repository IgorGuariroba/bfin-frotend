import { useGetApiV1Accounts } from '@igorguariroba/bfin-sdk/react-query';

export function useAccounts() {
  const query = useGetApiV1Accounts();

  // Expor função de refetch para uso manual
  const refetchAccounts = () => {
    return query.refetch();
  };

  return {
    ...query,
    refetchAccounts,
  };
}
