import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
} from '@chakra-ui/react';
import { LoanSimulationList } from './lists/LoanSimulationList';
import { LoanSimulationDetailsDialog } from './dialogs/LoanSimulationDetailsDialog';
import { LoanForm } from './forms/LoanForm';
import type { LoanSimulation } from '../../types/loanSimulation';

interface LoanSimulationsViewProps {
  onBack?: () => void;
}

export function LoanSimulationsView({ onBack }: LoanSimulationsViewProps) {
  const [selectedSimulation, setSelectedSimulation] = useState<LoanSimulation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleSelectSimulation = (simulation: LoanSimulation) => {
    setSelectedSimulation(simulation);
    setIsDetailsOpen(true);
  };

  const handleSuccess = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <VStack gap={0} align="stretch" minH="100vh" pb={8}>
      {/* Formulário */}
      <LoanForm onSuccess={handleSuccess} onCancel={handleCancel} />

      {/* Lista de Simulações */}
      <Box mx={6} mt={6} mb={8}>
        <Text fontSize="lg" fontWeight="bold" color="var(--foreground)" mb={4}>
          Minhas Simulações
        </Text>
        <LoanSimulationList onSelectSimulation={handleSelectSimulation} />
      </Box>

      {/* Dialog de Detalhes */}
      <LoanSimulationDetailsDialog
        simulation={selectedSimulation}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </VStack>
  );
}
