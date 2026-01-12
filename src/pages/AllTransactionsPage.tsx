import { useNavigate } from 'react-router-dom';
import { Container, Box, Heading, IconButton, VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { TransactionList } from '../components/organisms/lists';

export function AllTransactionsPage() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="var(--background)">
      {/* Header */}
      <Box as="header" bg="var(--card)" shadow="sm" borderBottomWidth="1px" borderBottomColor="var(--border)">
        <Container maxW="7xl" py={4}>
          <IconButton
            aria-label="Voltar"
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            mb={2}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Heading size="lg">Todas as Transações</Heading>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack gap={6} align="stretch">
          <TransactionList />
        </VStack>
      </Container>
    </Box>
  );
}
