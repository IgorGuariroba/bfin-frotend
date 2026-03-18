import { useState, useEffect } from 'react';
import { useAccounts } from './useAccounts';

// Interface que representa uma conta do SDK
interface SDKAccount {
  id?: string;
  account_name: string;
  available_balance: string;
  is_default?: boolean;
}

export interface UseAccountSelectionReturn {
  accounts: SDKAccount[] | undefined;
  selectedAccountId: string;
  selectedAccount: SDKAccount | undefined;
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
    accounts: accounts as SDKAccount[] | undefined,
    selectedAccountId,
    selectedAccount: selectedAccount as SDKAccount | undefined,
    isLoadingAccounts,
    handleAccountSelect,
  };
};