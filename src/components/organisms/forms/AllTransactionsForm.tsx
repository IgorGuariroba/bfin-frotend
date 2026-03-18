import { Container, Box, VStack } from '@chakra-ui/react';
import { List } from 'lucide-react';
import { TransactionList } from '../lists';
import { BaseForm } from '../../ui/BaseForm';

interface AllTransactionsFormProps {
  onBack?: () => void;
  onCancel?: () => void;
}

export function AllTransactionsForm({ onBack, onCancel }: AllTransactionsFormProps) {
  return (
    <BaseForm
      variant="green-header"
      title="Todas as Transações"
      subtitle="Histórico completo de receitas e despesas da sua conta."
      icon={List}
      onBack={onBack}
      onCancel={onCancel}
    >
      {/* Content */}
      <Container maxW="7xl" py={8} pb={{ base: 28, md: 20 }} mt={{ base: -10, md: -12 }}>
        <VStack gap={6} align="stretch">
          <Box
            bg="var(--card)"
            borderRadius="2xl"
            boxShadow="var(--shadow-md)"
            p={{ base: 4, md: 6 }}
          >
            <TransactionList maxH="none" />
          </Box>
        </VStack>
      </Container>
    </BaseForm>
  );
}