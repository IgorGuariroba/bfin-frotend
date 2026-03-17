import { Box, Text } from '@chakra-ui/react';
import { DollarSign } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useAccounts } from '../../hooks/useAccounts';

interface BfincontaWidgetProps {
  onAccessClick: () => void;
  variant?: 'default' | 'compact';
}

export const BfincontaWidget = ({
  onAccessClick,
  variant = 'default'
}: BfincontaWidgetProps) => {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();

  const totals = accounts?.reduce(
    (acc, account) => ({
      totalBalance: acc.totalBalance + Number(account.total_balance),
      availableBalance: acc.availableBalance + Number(account.available_balance),
      lockedBalance: acc.lockedBalance + Number(account.locked_balance),
      emergencyReserve: acc.emergencyReserve + Number(account.emergency_reserve),
    }),
    { totalBalance: 0, availableBalance: 0, lockedBalance: 0, emergencyReserve: 0 }
  ) || { totalBalance: 0, availableBalance: 0, lockedBalance: 0, emergencyReserve: 0 };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <BaseWidget
      icon={DollarSign}
      title="Bfinconta"
      isLoading={loadingAccounts}
      variant={variant}
      primaryAction={{
        label: 'ACESSAR',
        onClick: onAccessClick,
        colorPalette: 'brand'
      }}
    >
      <Box>
        <Text fontSize="xs" color="var(--muted-foreground)" mb={1}>
          Saldo disponível
        </Text>
        <Text
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          color="var(--foreground)"
          mb={2}
        >
          {formatCurrency(totals.availableBalance)}
        </Text>
        <Text fontSize="sm" color="var(--muted-foreground)">
          Valor investido: <Text as="span" fontWeight="medium">
            {formatCurrency(totals.emergencyReserve)}
          </Text>
        </Text>
      </Box>
    </BaseWidget>
  );
};