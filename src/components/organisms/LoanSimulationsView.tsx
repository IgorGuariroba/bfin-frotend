import { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Dialog,
  IconButton
} from '@chakra-ui/react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../atoms/Button';
import { LoanSimulationList } from './lists/LoanSimulationList';
import { LoanSimulationForm } from './forms/LoanSimulationForm';
import { LoanSimulationDetailsDialog } from './dialogs/LoanSimulationDetailsDialog';
import type { LoanSimulation } from '../../types/loanSimulation';

interface LoanSimulationsViewProps {
  onBack?: () => void;
}

export function LoanSimulationsView({ onBack }: LoanSimulationsViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<LoanSimulation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleSelectSimulation = (simulation: LoanSimulation) => {
    setSelectedSimulation(simulation);
    setIsDetailsOpen(true);
  };

  return (
    <Box p={{ base: 4, md: 8 }} pb="100px" minH="100vh">
      <VStack gap={8} align="stretch">
        {/* Header Section */}
        <HStack justify="space-between" wrap="wrap" gap={4}>
          <HStack gap={4}>
            {onBack && (
              <IconButton
                aria-label="Voltar"
                onClick={onBack}
                variant="ghost"
                size="sm"
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            )}
            <VStack align="start" gap={1}>
              <Heading size="lg">Empréstimos</Heading>
              <Text color="gray.500">Use sua reserva de emergência como garantia</Text>
            </VStack>
          </HStack>
          <Button onClick={() => setIsFormOpen(true)} colorPalette="brand">
            <Plus size={18} /> Nova Simulação
          </Button>
        </HStack>

        {/* Listagem */}
        <Box>
          <Heading size="md" mb={4}>Minhas Simulações</Heading>
          <LoanSimulationList onSelectSimulation={handleSelectSimulation} />
        </Box>
      </VStack>

      {/* Dialog de Nova Simulação */}
      <Dialog.Root open={isFormOpen} onOpenChange={(e) => setIsFormOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="var(--card)" borderRadius="2xl" maxW="lg">
            <Dialog.Header>
              <Dialog.Title>Nova Simulação de Empréstimo</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <LoanSimulationForm
                onSuccess={() => setIsFormOpen(false)}
                onCancel={() => setIsFormOpen(false)}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Dialog de Detalhes */}
      <LoanSimulationDetailsDialog 
        simulation={selectedSimulation}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </Box>
  );
}
