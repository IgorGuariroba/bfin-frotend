import {
  Dialog,
  Box,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { CheckCircle2 } from 'lucide-react';
import type { CreatedTransactionData } from '../../../hooks/useIncomeFormState';

interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: CreatedTransactionData | null;
  onNewTransaction: () => void;
  onBackToDashboard: () => void;
  type?: 'income' | 'expense';
}

export function TransactionSuccessModal({
  isOpen,
  onClose,
  transaction,
  onNewTransaction,
  onBackToDashboard,
  type = 'income'
}: TransactionSuccessModalProps) {
  const isIncome = type === 'income';
  const colorScheme = isIncome ? 'green' : 'red';
  const title = isIncome ? 'Depósito Confirmado!' : 'Despesa Confirmada!';
  const actionLabel = isIncome ? 'Novo Depósito' : 'Nova Despesa';
  const successMessage = isIncome ? 'foi adicionado com sucesso' : 'foi registrada com sucesso';

  if (!transaction) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details: { open: boolean }) => {
        if (!details.open) onClose();
      }}
    >
      <Dialog.Backdrop
        bg="rgba(0, 0, 0, 0.5)"
        backdropFilter="blur(4px)"
      />
      <Dialog.Positioner>
        <Dialog.Content
          bg="var(--card)"
          borderRadius="2xl"
          p={0}
          maxW="md"
          w="90%"
          mx={4}
          data-testid="success-message"
          css={{
            animation: 'slideInScale 0.3s ease-out',
            '@keyframes slideInScale': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px) scale(0.95)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
            },
          }}
        >
          {/* Header Colorido */}
          <Box
            bg={`${colorScheme}.500`}
            color="white"
            p={6}
            borderTopRadius="2xl"
            textAlign="center"
          >
            <VStack gap={3}>
              <Box
                bg="white"
                color={`${colorScheme}.500`}
                borderRadius="full"
                p={3}
                css={{
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                  },
                }}
              >
                <CheckCircle2 size={32} />
              </Box>
              <VStack gap={1}>
                <Text fontSize="xl" fontWeight="bold">
                  {title}
                </Text>
                <Text fontSize="3xl" fontWeight="bold">
                  {transaction.formattedAmount}
                </Text>
                <Text fontSize="sm" opacity={0.9}>
                  {successMessage}
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Detalhes */}
          <Box p={6}>
            <VStack gap={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold" color="var(--foreground)">
                Detalhes da Transação
              </Text>

              <VStack gap={3} align="stretch">
                <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                  <Text color="var(--muted-foreground)">Conta:</Text>
                  <Text fontWeight="medium" color="var(--foreground)">
                    {transaction.accountName}
                  </Text>
                </HStack>

                <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                  <Text color="var(--muted-foreground)">Categoria:</Text>
                  <Text fontWeight="medium" color="var(--foreground)">
                    {transaction.categoryName}
                  </Text>
                </HStack>

                <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                  <Text color="var(--muted-foreground)">Descrição:</Text>
                  <Text fontWeight="medium" color="var(--foreground)">
                    {transaction.description}
                  </Text>
                </HStack>

                <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                  <Text color="var(--muted-foreground)">Data:</Text>
                  <Text fontWeight="medium" color="var(--foreground)">
                    {new Date().toLocaleDateString('pt-BR')}
                  </Text>
                </HStack>
              </VStack>

              {/* Botões */}
              <VStack gap={3} mt={4}>
                <Button
                  onClick={onNewTransaction}
                  w="full"
                  size="lg"
                  bg={`${colorScheme}.500`}
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: `${colorScheme}.600` }}
                >
                  {actionLabel}
                </Button>

                <Button
                  onClick={onBackToDashboard}
                  variant="ghost"
                  size="sm"
                  color="var(--muted-foreground)"
                >
                  Voltar ao Dashboard
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}