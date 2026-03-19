import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { Zap } from 'lucide-react';
import { iconColors } from '../../theme';

interface LoanSimulationSummaryProps {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
}

export function LoanSimulationSummary({
  monthlyPayment,
  totalInterest,
  totalAmount,
}: LoanSimulationSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box
      bg={{ base: 'blue.50', _dark: 'blue.950' }}
      borderWidth="1px"
      borderColor={{ base: 'blue.200', _dark: 'blue.800' }}
      borderRadius="lg"
      p={4}
    >
      <HStack gap={2} mb={3}>
        <Zap size={18} color={iconColors.primary} />
        <Text fontWeight="semibold" color={{ base: 'blue.700', _dark: 'blue.300' }} fontSize="sm">
          Resumo da Simulação:
        </Text>
      </HStack>
      <VStack gap={2} align="stretch" fontSize="sm">
        <HStack justify="space-between">
          <Text color="muted.fg">Parcela estimada:</Text>
          <Text fontWeight="medium" color="var(--foreground)">
            {formatCurrency(monthlyPayment)}
          </Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="muted.fg">Total de juros:</Text>
          <Text fontWeight="medium" color="var(--foreground)">
            {formatCurrency(totalInterest)}
          </Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="muted.fg">Valor total:</Text>
          <Text fontWeight="medium" color="var(--foreground)">
            {formatCurrency(totalAmount)}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}