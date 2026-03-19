import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { CheckCircle2, Check } from 'lucide-react';
import { iconColors } from '../../theme';

export function LoanInfoBox() {
  return (
    <Box
      bg="var(--card)"
      borderWidth="1px"
      borderColor="var(--success-border)"
      borderRadius="lg"
      p={4}
    >
      <HStack gap={2} mb={3}>
        <CheckCircle2 size={18} color={iconColors.success} />
        <Text fontWeight="semibold" color="var(--success)" fontSize="sm">
          Como funciona:
        </Text>
      </HStack>
      <VStack gap={2} align="stretch" fontSize="sm" color="var(--foreground)">
        <HStack gap={2}>
          <Check size={16} color={iconColors.success} />
          <Text>Sua reserva de emergência é usada como garantia</Text>
        </HStack>
        <HStack gap={2}>
          <Check size={16} color={iconColors.success} />
          <Text>Taxas de juros mais baixas que empréstimos tradicionais</Text>
        </HStack>
        <HStack gap={2}>
          <Check size={16} color={iconColors.success} />
          <Text>Você continua com o rendimento da reserva</Text>
        </HStack>
      </VStack>
    </Box>
  );
}