import {
  Box,
  Heading,
  VStack,
  HStack,
  IconButton,
  Text
} from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { TransferForm } from './forms/TransferForm';

interface TransferViewProps {
  onBack?: () => void;
}

export function TransferView({ onBack }: TransferViewProps) {
  const handleSuccess = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} pb="100px" minH="100vh">
      <VStack gap={8} align="stretch">
        {/* Header Section */}
        <HStack justify="space-between" wrap="wrap" gap={4}>
          <HStack gap={4}>
            {onBack && (
              <IconButton
                aria-label="Voltar"
                onClick={onBack}
                variant="ghost"
                size="sm"
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            )}
            <VStack align="start" gap={1}>
              <Heading size="lg">Transferir</Heading>
              <Text color="var(--muted-foreground)" fontSize="sm">
                Transfira dinheiro entre suas contas
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Transfer Form */}
        <Box
          bg="var(--card)"
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          shadow="lg"
        >
          <TransferForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </Box>
      </VStack>
    </Box>
  );
}
