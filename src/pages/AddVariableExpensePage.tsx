import { useNavigate } from 'react-router-dom';
import { Container, Box, Heading, IconButton, VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';

export function AddVariableExpensePage() {
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
          <Heading size="lg">Nova Despesa</Heading>
        </Box>

        <Box
          bg="card"
          borderRadius="lg"
          p={6}
          shadow="sm"
        >
          <Box textAlign="center" color="gray.500">
            Esta página foi removida. Use a página de Nova Despesa Fixa com type=variable.
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
