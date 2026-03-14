import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, Heading, IconButton, VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { ExpenseForm } from '../components/organisms/forms';

export function AddFixedExpensePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as 'fixed' | 'variable' | null;

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
          <Heading size="lg">
            {type === 'fixed' ? 'Nova Despesa Fixa' : 'Nova Despesa Variável'}
          </Heading>
        </Box>

        <Box
          bg="card"
          borderRadius="lg"
          p={6}
          shadow="sm"
        >
          <ExpenseForm
            defaultType={type || 'variable'}
            onSuccess={() => navigate('/dashboard')}
            onCancel={() => navigate('/dashboard')}
          />
        </Box>
      </VStack>
    </Container>
  );
}
