import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { Zap, Check } from 'lucide-react';

interface HowItWorksInfoProps {
  daysConsidered: number;
}

/**
 * Componente informativo sobre como funciona o cálculo do limite diário
 */
export function HowItWorksInfo({ daysConsidered }: HowItWorksInfoProps) {
  return (
    <Box
      w="full"
      bg="var(--card)"
      borderWidth="1px"
      borderColor="var(--success-border)"
      borderRadius="lg"
      p={4}
    >
      <HStack gap={2} mb={3}>
        <Zap size={18} color="var(--success)" />
        <Text fontWeight="semibold" color="var(--success)" fontSize="sm">
          Como funciona:
        </Text>
      </HStack>

      <VStack gap={2} align="stretch" fontSize="sm" color="var(--foreground)">
        <HStack gap={2}>
          <Check size={16} color="var(--success)" />
          <Text>
            O limite é{' '}
            <Text as="span" fontWeight="bold">
              calculado automaticamente
            </Text>{' '}
            baseado no seu saldo disponível
          </Text>
        </HStack>

        <HStack gap={2}>
          <Check size={16} color="var(--success)" />
          <Text>
            O cálculo considera os{' '}
            <Text as="span" fontWeight="bold">
              próximos {daysConsidered} dias
            </Text>{' '}
            para otimizar seus gastos
          </Text>
        </HStack>

        <HStack gap={2}>
          <Check size={16} color="var(--success)" />
          <Text>O sistema te alerta quando estiver próximo do limite</Text>
        </HStack>
      </VStack>
    </Box>
  );
}