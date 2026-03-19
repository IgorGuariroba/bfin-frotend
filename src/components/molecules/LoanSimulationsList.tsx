import { Box, HStack, Text, Badge, SimpleGrid } from '@chakra-ui/react';
import { Clock } from 'lucide-react';
import { LoanSimulationCard } from './LoanSimulationCard';
import type { LoanSimulation } from '../../types/loanSimulation';

interface LoanSimulationsListProps {
  simulations: LoanSimulation[];
  onViewSimulation: (simulation: LoanSimulation) => void;
  onApproveSimulation: (simulation: LoanSimulation) => void;
  onWithdrawSimulation: (simulation: LoanSimulation) => void;
  onDeleteSimulation: (simulation: LoanSimulation) => void;
  isApproving?: boolean;
  isWithdrawing?: boolean;
  isDeleting?: boolean;
}

export function LoanSimulationsList({
  simulations,
  onViewSimulation,
  onApproveSimulation,
  onWithdrawSimulation,
  onDeleteSimulation,
  isApproving,
  isWithdrawing,
  isDeleting,
}: LoanSimulationsListProps) {
  return (
    <Box px={{ base: 4, md: 6 }} mt={6} mb={8}>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="var(--foreground)">
          Minhas Simulações
        </Text>
        {simulations.length > 0 && (
          <Badge variant="subtle" colorPalette="gray">
            {simulations.length} {simulations.length === 1 ? 'simulação' : 'simulações'}
          </Badge>
        )}
      </HStack>

      {simulations.length === 0 ? (
        <Box
          bg="var(--card)"
          borderRadius="xl"
          p={8}
          textAlign="center"
        >
          <Clock size={48} color="var(--muted-foreground)" style={{ margin: '0 auto 16px' }} />
          <Text color="var(--muted-foreground)" fontSize="sm">
            Nenhuma simulação encontrada.
          </Text>
          <Text color="var(--muted-foreground)" fontSize="xs" mt={1}>
            Crie uma simulação para começar.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          {simulations.map((simulation) => (
            <LoanSimulationCard
              key={simulation.id}
              simulation={simulation}
              onView={onViewSimulation}
              onApprove={onApproveSimulation}
              onWithdraw={onWithdrawSimulation}
              onDelete={onDeleteSimulation}
              isApproving={isApproving}
              isWithdrawing={isWithdrawing}
              isDeleting={isDeleting}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
