import { Box, HStack, VStack, Text, Badge, Icon } from '@chakra-ui/react';
import { CircleDollarSign, Clock } from 'lucide-react';
import { 
  type LoanSimulation, 
  LOAN_SIMULATION_STATUS_LABELS, 
  LOAN_SIMULATION_STATUS_COLORS 
} from '../../types/loanSimulation';
import { loanSimulationService } from '../../services/loanSimulationService';

interface LoanSimulationCardProps {
  simulation: LoanSimulation;
  onClick?: () => void;
}

export function LoanSimulationCard({ simulation, onClick }: LoanSimulationCardProps) {
  const statusLabel = LOAN_SIMULATION_STATUS_LABELS[simulation.status];
  const statusColor = LOAN_SIMULATION_STATUS_COLORS[simulation.status];

  return (
    <Box 
      p={4} 
      bg="card" 
      borderRadius="lg" 
      shadow="sm" 
      borderWidth="1px" 
      borderColor="border.subtle"
      transition="all 0.2s"
      _hover={{ shadow: 'md', cursor: onClick ? 'pointer' : 'default', borderColor: 'brand.500' }}
      onClick={onClick}
    >
      <VStack gap={3} align="stretch">
        <HStack justify="space-between">
          <Badge colorPalette={statusColor} variant="subtle">
            {statusLabel}
          </Badge>
          <Text fontSize="xs" color="gray.500">
            {loanSimulationService.formatDate(simulation.createdAt)}
          </Text>
        </HStack>

        <HStack gap={4} justify="space-between">
          <VStack gap={0} align="start">
            <Text fontSize="sm" color="gray.500">Valor</Text>
            <Text fontWeight="bold" fontSize="lg">
              {loanSimulationService.formatCurrency(simulation.amount)}
            </Text>
          </VStack>

          <VStack gap={0} align="end">
            <Text fontSize="sm" color="gray.500">Parcelas</Text>
            <Text fontWeight="bold">
              {simulation.termMonths}x {loanSimulationService.formatCurrency(simulation.installmentAmount)}
            </Text>
          </VStack>
        </HStack>

        <HStack gap={4} fontSize="xs" color="gray.500">
          <HStack gap={1}>
            <Icon as={Clock} boxSize={3.5} />
            <Text>{simulation.termMonths} meses</Text>
          </HStack>
          <HStack gap={1}>
            <Icon as={CircleDollarSign} boxSize={3.5} />
            <Text>{loanSimulationService.formatPercentage(simulation.interestRateMonthly)} a.m.</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}
