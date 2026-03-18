import { useState, useEffect } from 'react';
import { useAccounts } from './useAccounts';

export interface Account {
  id: string;
  account_name: string;
  available_balance: string;
  is_default?: boolean;
}

export interface UseAccountSelectionReturn {
  accounts: Account[] | undefined;
  selectedAccountId: string;
  selectedAccount: Account | undefined;
  isLoadingAccounts: boolean;
  handleAccountSelect: (accountId: string) => void;
}

/**
 * Hook para gerenciar a seleção de contas
 * Automaticamente seleciona a conta padrão quando disponível
 */
export const useAccountSelection = (): UseAccountSelectionReturn => {
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  // Define a conta padrão quando as contas forem carregadas
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setSelectedAccountId(defaultAccount.id);
      }
    }
  }, [accounts, selectedAccountId]);

  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  return {
    accounts,
    selectedAccountId,
    selectedAccount,
    isLoadingAccounts,
    handleAccountSelect,
  };
};