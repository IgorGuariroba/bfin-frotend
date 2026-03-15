import {
  Container
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TransferView } from '../components/organisms/TransferView';

export function TransferPage() {
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" py={8}>
      <TransferView onBack={() => navigate('/dashboard')} />
    </Container>
  );
}
