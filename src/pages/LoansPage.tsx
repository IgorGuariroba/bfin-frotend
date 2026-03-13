import { 
  Container
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LoanSimulationsView } from '../components/organisms/LoanSimulationsView';

export function LoansPage() {
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" py={8}>
      <LoanSimulationsView onBack={() => navigate('/dashboard')} />
    </Container>
  );
}
