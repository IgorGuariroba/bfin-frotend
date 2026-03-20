import { VStack } from '@chakra-ui/react';
import { Target } from 'lucide-react';
import { BaseForm } from '../../ui/BaseForm';
import { useDailyLimit } from '../../../hooks/useDailyLimit';
import { useAccountSelection } from '../../../hooks/useAccountSelection';
import { useDailyLimitCalculations } from '../../../hooks/useDailyLimitCalculations';
import { formatCurrency } from '../../../utils/formatters';
import { AccountSelector } from '../../molecules/AccountSelector';
import { LimitInfoCard } from '../../molecules/LimitInfoCard';
import { CalculationInfo } from '../../molecules/CalculationInfo';
import { HowItWorksInfo } from '../../molecules/HowItWorksInfo';
import { NoAccountsMessage } from '../../molecules/NoAccountsMessage';

interface DailyLimitFormProps {
  onCancel?: () => void;
}

export function DailyLimitForm({ onCancel }: DailyLimitFormProps) {
  const { accounts, selectedAccount, isLoadingAccounts, handleAccountSelect } = useAccountSelection();
  const { data: limitData, isLoading: loadingLimit } = useDailyLimit(selectedAccount?.id || '');
  const calculations = useDailyLimitCalculations(limitData);

  // Early return para quando não há contas
  if (!accounts || accounts.length === 0) {
    return <NoAccountsMessage onCancel={onCancel} />;
  }

  return (
    <BaseForm
      title="Limite Diário"
      subtitle="Gerencie seus gastos diários"
      icon={Target}
      variant="green-header"
      onBack={onCancel}
      isLoading={isLoadingAccounts || loadingLimit}
      contentPb={24}
      displayValue={{
        value: formatCurrency(calculations.dailyLimit),
        label: "Limite calculado automaticamente"
      }}
    >
      <VStack gap={4} px={{ base: 4, md: 6 }}>
        <AccountSelector
          accounts={accounts}
          selectedAccountId={selectedAccount?.id || ''}
          onAccountSelect={handleAccountSelect}
          showBalance={true}
        />

        <LimitInfoCard calculations={calculations} />

        <CalculationInfo calculations={calculations} />

        <HowItWorksInfo daysConsidered={calculations.daysConsidered} />
      </VStack>
    </BaseForm>
  );
}