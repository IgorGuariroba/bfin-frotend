import { SimpleGrid, Text, Spinner, Center } from '@chakra-ui/react';
import { LoanSimulationCard } from '../../molecules/LoanSimulationCard';
import { useLoanSimulations } from '../../../hooks/useLoanSimulations';
import type { LoanSimulationStatus, LoanSimulation } from '../../../types/loanSimulation';

interface LoanSimulationListProps {
  status?: LoanSimulationStatus;
  onSelectSimulation?: (simulation: LoanSimulation) => void;
}

export function LoanSimulationList({ status, onSelectSimulation }: LoanSimulationListProps) {
  const { data, isLoading, error } = useLoanSimulations({ status });

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" colorPalette="brand" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500">Erro ao carregar simulações.</Text>
      </Center>
    );
  }

  const simulations = data?.simulations || [];

  if (simulations.length === 0) {
    return (
      <Center py={10} flexDirection="column">
        <Text color="gray.500" mb={4}>Nenhuma simulação encontrada.</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      {simulations.map((simulation) => (
        <LoanSimulationCard 
          key={simulation.id} 
          simulation={simulation} 
          onClick={() => onSelectSimulation?.(simulation)}
        />
      ))}
    </SimpleGrid>
  );
}
