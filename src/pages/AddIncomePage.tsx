import { useNavigate } from 'react-router-dom';
import { Container, Box, Heading, IconButton, VStack, Card } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { IncomeForm } from '../components/organisms/forms';

export function AddIncomePage() {
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
          <Heading size="lg">Nova Receita</Heading>
        </Box>

        <Card.Root bg="white" borderRadius="lg" shadow="md">
          <Card.Body p={6}>
            <IncomeForm
              onSuccess={() => navigate('/dashboard')}
              onCancel={() => navigate('/dashboard')}
            />
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}
