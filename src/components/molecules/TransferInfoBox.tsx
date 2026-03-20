import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { Zap, Check } from 'lucide-react';
import { iconColors } from '../../theme';

export function TransferInfoBox() {
  return (
    <Box
      bg={{ base: 'green.50', _dark: 'green.950' }}
      borderWidth="1px"
      borderColor={{ base: 'green.200', _dark: 'green.800' }}
      borderRadius="lg"
      p={4}
    >
      <HStack gap={2} mb={3}>
        <Zap size={18} color={iconColors.success} />
        <Text fontWeight="semibold" color={{ base: 'green.700', _dark: 'green.300' }} fontSize="sm">
          Como funciona:
        </Text>
      </HStack>
      <VStack gap={2} align="stretch" fontSize="sm" color="muted.fg">
        <HStack gap={2}>
          <Check size={16} color={iconColors.success} />
          <Text>O valor será transferido imediatamente</Text>
        </HStack>
        <HStack gap={2}>
          <Check size={16} color={iconColors.success} />
          <Text>Verifique o ID da conta de destino</Text>
        </HStack>
      </VStack>
    </Box>
  );
}