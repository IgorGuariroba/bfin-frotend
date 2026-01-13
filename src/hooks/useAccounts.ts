import { useGetApiV1Accounts } from '@igorguariroba/bfin-sdk/react-query';

export function useAccounts() {
  return useGetApiV1Accounts();
}
