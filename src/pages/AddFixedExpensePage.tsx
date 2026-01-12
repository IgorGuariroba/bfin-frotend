import { useNavigate } from 'react-router-dom';
import { Container, Box, Heading, IconButton, VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { FixedExpenseForm } from '../components/organisms/forms';

export function AddFixedExpensePage() {
  const navigate = useNavigate();

  return (
    <Container maxW="2xl" py={8}>
      <VStack gap={6} align="stretch">
        <Box>
          <IconButton
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar"
            mb={4}
          >
            <ArrowLeft />
          </IconButton>
          <Heading size="lg">Nova Despesa Fixa</Heading>
        </Box>

        <Box
          bg="card"
          borderRadius="lg"
          p={6}
          shadow="sm"
        >
          <FixedExpenseForm
            onSuccess={() => navigate('/dashboard')}
            onCancel={() => navigate('/dashboard')}
          />
        </Box>
      </VStack>
    </Container>
  );
}
