import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BaseWidget } from './BaseWidget';

interface RecentTransactionsWidgetProps {
  variant?: 'default' | 'compact';
}

interface MockTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export const RecentTransactionsWidget = ({
  variant = 'default'
}: RecentTransactionsWidgetProps) => {
  // Mock data for now - in real implementation this would come from API
  const recentTransactions: MockTransaction[] = [
    {
      id: '1',
      description: 'Salário',
      amount: 5000,
      type: 'income',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      description: 'Mercado',
      amount: -150.50,
      type: 'expense',
      date: new Date().toISOString(),
    },
    {
      id: '3',
      description: 'Freelance',
      amount: 800,
      type: 'income',
      date: new Date().toISOString(),
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  return (
    <BaseWidget
      icon={Receipt}
      title="Transações Recentes"
      variant={variant}
      data-testid="recent-transactions"
    >
      <VStack gap={3} align="stretch">
        {recentTransactions.map((transaction) => (
          <HStack key={transaction.id} justify="space-between" align="center">
            <HStack gap={2}>
              <Box
                p={1}
                borderRadius="md"
                bg={transaction.type === 'income' ? 'var(--success-background)' : 'var(--destructive-background)'}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpRight size={16} color="var(--success)" />
                ) : (
                  <ArrowDownRight size={16} color="var(--destructive)" />
                )}
              </Box>
              <Text fontSize="sm" fontWeight="medium">
                {transaction.description}
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={transaction.type === 'income' ? 'var(--success)' : 'var(--destructive)'}
            >
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </Text>
          </HStack>
        ))}

        {recentTransactions.length === 0 && (
          <Box py={4} textAlign="center">
            <Text fontSize="sm" color="var(--muted-foreground)">
              Nenhuma transação recente
            </Text>
          </Box>
        )}
      </VStack>
    </BaseWidget>
  );
};