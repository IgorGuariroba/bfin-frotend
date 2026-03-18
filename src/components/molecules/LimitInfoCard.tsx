import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { CircularProgress } from './CircularProgress';
import { formatCurrency } from '../../utils/formatters';
import type { DailyLimitCalculations } from '../../hooks/useDailyLimitCalculations';

interface LimitInfoCardProps {
  calculations: DailyLimitCalculations;
}

/**
 * Card com informações visuais do limite diário
 * Mostra progresso circular e valores principais
 */
export function LimitInfoCard({ calculations }: LimitInfoCardProps) {
  const { percentageUsed, progressColor, spentToday, remaining, exceeded } = calculations;

  return (
    <Box
      w="full"
      bg="var(--card)"
      borderRadius="xl"
      p={6}
      shadow="md"
      mb={6}
    >
      {/* Gráfico circular do uso */}
      <CircularProgress
        percentage={percentageUsed}
        color={progressColor}
        label="Usado"
      />

      {/* Valores em duas colunas */}
      <HStack justify="space-between" gap={6} mt={6}>
        <VStack align="center" flex="1">
          <Text fontSize="sm" color="var(--muted-foreground)">
            Gasto Hoje
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={exceeded ? "#ef4444" : "var(--card-foreground)"}
          >
            {formatCurrency(spentToday)}
          </Text>
        </VStack>

        <VStack align="center" flex="1">
          <Text fontSize="sm" color="var(--muted-foreground)">
            Restante
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={exceeded ? "#ef4444" : "var(--primary)"}
          >
            {formatCurrency(remaining)}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}