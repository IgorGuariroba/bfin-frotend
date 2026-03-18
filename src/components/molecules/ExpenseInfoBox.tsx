import { Box, VStack, HStack, Text } from '@chakra-ui/react';
import { Zap, Check } from 'lucide-react';
import { iconColors } from '../../theme';

interface ExpenseInfoBoxProps {
  isFixed: boolean;
}

export function ExpenseInfoBox({ isFixed }: ExpenseInfoBoxProps) {
  return (
    <Box
      bg={{ base: 'brand.50', _dark: 'brand.950' }}
      borderWidth="1px"
      borderColor={{ base: 'brand.200', _dark: 'brand.800' }}
      borderRadius="lg"
      p={4}
    >
      <HStack gap={2} mb={3}>
        <Zap size={18} color={iconColors.brandDark} />
        <Text fontWeight="semibold" color={{ base: 'brand.700', _dark: 'brand.300' }} fontSize="sm">
          Como funciona:
        </Text>
      </HStack>
      <VStack gap={2} align="stretch" fontSize="sm" color="var(--foreground)">
        <HStack gap={2}>
          <Check size={16} color={iconColors.brandDark} />
          <Text>O valor será <strong>debitado imediatamente</strong> da sua conta</Text>
        </HStack>
        <HStack gap={2}>
          <Check size={16} color={iconColors.brandDark} />
          <Text>
            {isFixed
              ? 'Ideal para gastos fixos mensais (aluguel, assinatura)'
              : 'Perfeito para gastos do dia a dia'}
          </Text>
        </HStack>
        <HStack gap={2}>
          <Check size={16} color={iconColors.brandDark} />
          <Text>Reduz o saldo disponível na hora</Text>
        </HStack>
      </VStack>
    </Box>
  );
}