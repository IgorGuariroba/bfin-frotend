'use client';

import React from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { Wallet } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useDailyLimit } from '../../hooks/useDailyLimit';
import { useAccountSelection } from '../../hooks/useAccountSelection';

interface DailyLimitWidgetProps {
  variant?: 'default' | 'compact';
}

export const DailyLimitWidget: React.FC<DailyLimitWidgetProps> = ({
  variant = 'default',
}) => {
  const { selectedAccountId } = useAccountSelection();
  const { data, isLoading, error } = useDailyLimit(selectedAccountId || undefined);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Determinar cor baseada no status
  const getProgressColor = () => {
    if (!data) return 'var(--primary)';
    if (data.exceeded) return 'var(--destructive)';
    if (data.percentageUsed >= 80) return 'var(--warning)';
    return 'var(--primary)';
  };

  const percentage = Math.min(data?.percentageUsed || 0, 100);
  const progressColor = getProgressColor();

  return (
    <BaseWidget
      icon={Wallet}
      title="Limite Diário"
      subtitle={data ? `${data.daysConsidered} dias considerados` : undefined}
      isLoading={isLoading}
      error={error?.message || null}
      variant={variant}
      data-testid="daily-limit-widget"
    >
      {data && (
        <VStack gap={3} align="stretch">
          {/* Porcentagem */}
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" color={progressColor}>
            {percentage.toFixed(0)}%
          </Text>

          {/* Barra de progresso */}
          <Box
            w="100%"
            h="12px"
            bg="var(--muted)"
            borderRadius="full"
            overflow="hidden"
          >
            <Box
              h="100%"
              w={`${percentage}%`}
              bg={progressColor}
              borderRadius="full"
              transition="width 0.3s ease"
            />
          </Box>

          {/* Valores */}
          <HStack justify="space-between">
            <VStack gap={0} align="flex-start">
              <Text fontSize="xs" color="var(--muted-foreground)">
                Gasto
              </Text>
              <Text fontSize="md" fontWeight="semibold" color="var(--foreground)">
                {formatCurrency(data.spentToday)}
              </Text>
            </VStack>

            <VStack gap={0} align="flex-end">
              <Text fontSize="xs" color="var(--muted-foreground)">
                Limite
              </Text>
              <Text fontSize="md" fontWeight="semibold" color="var(--foreground)">
                {formatCurrency(data.dailyLimit)}
              </Text>
            </VStack>
          </HStack>

          {/* Restante (se não excedido) */}
          {!data.exceeded && data.remaining > 0 && (
            <Box
              bg="var(--accent)"
              borderRadius="md"
              p={2}
              textAlign="center"
            >
              <Text fontSize="xs" color="var(--accent-foreground)">
                Restam {formatCurrency(data.remaining)} para hoje
              </Text>
            </Box>
          )}

          {/* Alerta quando excedido */}
          {data.exceeded && (
            <Box
              bg="var(--destructive)"
              borderRadius="md"
              p={2}
              textAlign="center"
            >
              <Text fontSize="xs" fontWeight="medium" color="var(--destructive-foreground)">
                Limite excedido em {formatCurrency(Math.abs(data.remaining))}
              </Text>
            </Box>
          )}
        </VStack>
      )}
    </BaseWidget>
  );
};
