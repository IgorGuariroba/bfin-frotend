import { Box, VStack, Text } from '@chakra-ui/react';
import { Target } from 'lucide-react';
import { BaseForm } from '../ui/BaseForm';
import { Button } from '../atoms/Button';

interface NoAccountsMessageProps {
  onCancel?: () => void;
}

/**
 * Componente exibido quando o usuário não possui contas
 */
export function NoAccountsMessage({ onCancel }: NoAccountsMessageProps) {
  return (
    <BaseForm
      title="Limite Diário"
      variant="green-header"
      icon={Target}
      onBack={onCancel}
    >
      <Box px={{ base: 4, md: 6 }} py={8}>
        <VStack gap={4} align="center">
          <Text color="var(--muted-foreground)" fontSize="sm" textAlign="center">
            Você precisa criar uma conta primeiro.
          </Text>
          {onCancel && (
            <Button size="sm" variant="outline" onClick={onCancel}>
              Voltar
            </Button>
          )}
        </VStack>
      </Box>
    </BaseForm>
  );
}