import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { Info, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { DailyLimitCalculations } from '../../hooks/useDailyLimitCalculations';

interface CalculationInfoProps {
  calculations: DailyLimitCalculations;
}

/**
 * Componente que exibe informações detalhadas sobre o cálculo do limite
 */
export function CalculationInfo({ calculations }: CalculationInfoProps) {
  const { availableBalance, daysConsidered, calculatedAt } = calculations;

  return (
    <Box
      w="full"
      bg="var(--muted)"
      borderRadius="lg"
      p={4}
    >
      <HStack gap={2} mb={3}>
        <Info size={18} color="var(--primary)" />
        <Text fontWeight="semibold" color="var(--card-foreground)" fontSize="sm">
          Informações do Cálculo
        </Text>
      </HStack>

      <VStack gap={3} align="stretch">
        <HStack justify="space-between">
          <HStack gap={2}>
            <DollarSign size={16} color="var(--muted-foreground)" />
            <Text fontSize="sm" color="var(--muted-foreground)">
              Saldo disponível:
            </Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium" color="var(--card-foreground)">
            {formatCurrency(availableBalance)}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <HStack gap={2}>
            <Calendar size={16} color="var(--muted-foreground)" />
            <Text fontSize="sm" color="var(--muted-foreground)">
              Dias considerados:
            </Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium" color="var(--card-foreground)">
            {daysConsidered} dias
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="var(--muted-foreground)">
            Calculado em:
          </Text>
          <Text fontSize="sm" fontWeight="medium" color="var(--card-foreground)">
            {formatDate(calculatedAt)}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}