import { useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  SimpleGrid,
  Dialog,
  Spinner,
  IconButton
} from '@chakra-ui/react';
import { Plus, ShieldCheck, TrendingUp, Wallet, ArrowLeft } from 'lucide-react';
import { Button } from '../atoms/Button';
import { LoanSimulationList } from './lists/LoanSimulationList';
import { LoanSimulationForm } from './forms/LoanSimulationForm';
import { LoanSimulationDetailsDialog } from './dialogs/LoanSimulationDetailsDialog';
import { useEmergencyReserve } from '../../hooks/useLoanSimulations';
import { useAccounts } from '../../hooks/useAccounts';
import { loanSimulationService } from '../../services/loanSimulationService';
import type { LoanSimulation } from '../../types/loanSimulation';

interface LoanSimulationsViewProps {
  onBack?: () => void;
}

export function LoanSimulationsView({ onBack }: LoanSimulationsViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<LoanSimulation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Buscar conta padrão (ou a primeira se não houver padrão)
  const { data: accountsData, isLoading: isLoadingAccounts } = useAccounts();
  const accountId = accountsData?.find(a => a.is_default)?.id || accountsData?.[0]?.id;

  // Buscar status da reserva
  const { data: reserveStatus, isLoading: isLoadingReserve } = useEmergencyReserve(accountId);

  // Considerar carregando se as contas ou a reserva estiverem carregando
  const isInitialLoading = isLoadingAccounts || (accountId && isLoadingReserve);

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

        {/* Status da Reserva */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Box p={5} bg="card" borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="border.subtle">
            <VStack align="start" gap={1}>
              <HStack color="brand.500">
                <Icon as={ShieldCheck} boxSize={4} />
                <Text fontWeight="bold" fontSize="xs" textTransform="uppercase">Reserva Total</Text>
              </HStack>
              {isInitialLoading ? (
                <Spinner size="xs" />
              ) : (
                <Text fontSize="xl" fontWeight="bold">
                  {loanSimulationService.formatCurrency(reserveStatus?.totalReserve || 0)}
                </Text>
              )}
            </VStack>
          </Box>

          <Box p={5} bg="card" borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="border.subtle">
            <VStack align="start" gap={1}>
              <HStack color="blue.500">
                <Icon as={TrendingUp} boxSize={4} />
                <Text fontWeight="bold" fontSize="xs" textTransform="uppercase">Limite (70%)</Text>
              </HStack>
              {isInitialLoading ? (
                <Spinner size="xs" />
              ) : (
                <Text fontSize="xl" fontWeight="bold">
                  {loanSimulationService.formatCurrency(reserveStatus?.loanLimit || 0)}
                </Text>
              )}
            </VStack>
          </Box>

          <Box p={5} bg="card" borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="border.subtle">
            <VStack align="start" gap={1}>
              <HStack color="green.500">
                <Icon as={Wallet} boxSize={4} />
                <Text fontWeight="bold" fontSize="xs" textTransform="uppercase">Disponível</Text>
              </HStack>
              {isInitialLoading ? (
                <Spinner size="xs" />
              ) : (
                <Text fontSize="xl" fontWeight="bold">
                  {loanSimulationService.formatCurrency(reserveStatus?.remainingLoanCapacity || 0)}
                </Text>
              )}
            </VStack>
          </Box>
        </SimpleGrid>

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
