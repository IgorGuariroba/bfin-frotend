import { useNavigate } from 'react-router-dom';
import { Container, Box, Heading, IconButton, VStack, Text } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { TransactionList } from '../components/organisms/lists';

interface AllTransactionsViewProps {
  onBack: () => void;
}

export function AllTransactionsView({ onBack }: AllTransactionsViewProps) {
  return (
    <Box minH="100vh" bg="var(--background)">
      {/* Header */}
      <Box
        as="header"
        bg="var(--primary)"
        pt={{ base: 6, md: 8 }}
        pb={{ base: 12, md: 14 }}
      >
        <Container maxW="7xl">
          <VStack align="stretch" gap={3}>
            <IconButton
              aria-label="Voltar"
              onClick={onBack}
              variant="ghost"
              size="sm"
              color="var(--primary-foreground)"
              alignSelf="flex-start"
              _hover={{ bg: 'var(--primary-600)' }}
              _active={{ bg: 'var(--primary-700)' }}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <Heading size="lg" color="var(--primary-foreground)">
              Todas as Transações
            </Heading>
            <Text fontSize="sm" color="var(--primary-foreground)" opacity={0.88}>
              Histórico completo de receitas e despesas da sua conta.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
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
    </Box>
  );
}

export function AllTransactionsPage() {
  const navigate = useNavigate();

  return <AllTransactionsView onBack={() => navigate('/dashboard')} />;
}
