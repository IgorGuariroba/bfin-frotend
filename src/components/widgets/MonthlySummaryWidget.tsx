import { Box, Text, HStack } from '@chakra-ui/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BaseWidget } from './BaseWidget';

interface MonthlySummaryWidgetProps {
  variant?: 'default' | 'compact';
}

export const MonthlySummaryWidget = ({
  variant = 'default'
}: MonthlySummaryWidgetProps) => {
  // Mock data for now - in real implementation this would come from API
  const monthlyIncome = 5000;
  const monthlyExpenses = 3500;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <BaseWidget
      icon={TrendingUp}
      title="Resumo Mensal"
      variant={variant}
      data-testid="monthly-summary"
    >
      <Box>
        <HStack justify="space-between" mb={3}>
          <Box>
            <Text fontSize="xs" color="var(--muted-foreground)" mb={1}>
              Receitas
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="var(--success)"
              data-testid="monthly-income"
            >
              {formatCurrency(monthlyIncome)}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="xs" color="var(--muted-foreground)" mb={1}>
              Despesas
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="var(--destructive)"
              data-testid="monthly-expenses"
            >
              {formatCurrency(monthlyExpenses)}
            </Text>
          </Box>
        </HStack>

        <Box pt={3} borderTop="1px solid var(--border)">
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color="var(--muted-foreground)">
              Saldo do mês
            </Text>
            <HStack gap={1}>
              {monthlyIncome > monthlyExpenses ? (
                <TrendingUp size={16} color="var(--success)" />
              ) : (
                <TrendingDown size={16} color="var(--destructive)" />
              )}
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={monthlyIncome > monthlyExpenses ? "var(--success)" : "var(--destructive)"}
              >
                {formatCurrency(monthlyIncome - monthlyExpenses)}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </BaseWidget>
  );
};