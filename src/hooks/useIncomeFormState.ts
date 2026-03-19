import { useState } from 'react';

interface CreatedTransactionData {
  amount: number;
  description: string;
  accountName?: string;
  categoryName?: string;
  formattedAmount: string;
}

interface IncomeFormState {
  buttonState: 'idle' | 'loading' | 'success';
  showConfirmationModal: boolean;
  isCategoryDialogOpen: boolean;
  createdTransaction: CreatedTransactionData | null;
  amountInputValue: string;
}

export function useIncomeFormState() {
  const [state, setState] = useState<IncomeFormState>({
    buttonState: 'idle',
    showConfirmationModal: false,
    isCategoryDialogOpen: false,
    createdTransaction: null,
    amountInputValue: '',
  });

  const actions = {
    setButtonState: (buttonState: IncomeFormState['buttonState']) =>
      setState(prev => ({ ...prev, buttonState })),

    setShowConfirmationModal: (show: boolean) =>
      setState(prev => ({ ...prev, showConfirmationModal: show })),

    setIsCategoryDialogOpen: (open: boolean) =>
      setState(prev => ({ ...prev, isCategoryDialogOpen: open })),

    setCreatedTransaction: (transaction: CreatedTransactionData | null) =>
      setState(prev => ({ ...prev, createdTransaction: transaction })),

    setAmountInputValue: (value: string) =>
      setState(prev => ({ ...prev, amountInputValue: value })),

    resetForm: () =>
      setState(prev => ({
        ...prev,
        buttonState: 'idle',
        amountInputValue: '',
        createdTransaction: null,
      })),
  };

  return {
    ...state,
    actions,
  };
}

export type { CreatedTransactionData, IncomeFormState };