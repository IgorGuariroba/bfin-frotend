import { 
  Dialog, 
  Table, 
  VStack, 
  HStack, 
  Text, 
  Separator, 
  Box, 
  Badge,
  Grid,
  GridItem,
  
  
} from '@chakra-ui/react';
import { Check, ArrowDownToLine, Trash2 } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { 
  type LoanSimulation, 
  LOAN_SIMULATION_STATUS_LABELS, 
  LOAN_SIMULATION_STATUS_COLORS 
} from '../../../types/loanSimulation';
import { loanSimulationService } from '../../../services/loanSimulationService';
import { 
  useApproveLoanSimulation, 
  useWithdrawLoanSimulation, 
  useDeleteLoanSimulation 
} from '../../../hooks/useLoanSimulations';

interface LoanSimulationDetailsDialogProps {
  simulation: LoanSimulation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoanSimulationDetailsDialog({ 
  simulation, 
  open, 
  onOpenChange,
  onSuccess 
}: LoanSimulationDetailsDialogProps) {
  const approveMutation = useApproveLoanSimulation();
  const withdrawMutation = useWithdrawLoanSimulation();
  const deleteMutation = useDeleteLoanSimulation();

  if (!simulation) return null;

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(simulation.id);
      onSuccess?.();
    } catch {
      // Ignore error as it's handled by the mutation
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync(simulation.id);
      onSuccess?.();
    } catch {
      // Ignore error as it's handled by the mutation
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta simulação?')) {
      try {
        await deleteMutation.mutateAsync(simulation.id);
        onOpenChange(false);
        onSuccess?.();
      } catch {
        // Ignore error as it's handled by the mutation
      }
    }
  };

  const statusLabel = LOAN_SIMULATION_STATUS_LABELS[simulation.status];
  const statusColor = LOAN_SIMULATION_STATUS_COLORS[simulation.status];
  const daysRemaining = loanSimulationService.getDaysUntilExpiration(simulation);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="var(--card)" borderRadius="2xl" maxW="2xl">
          <Dialog.Header>
          <HStack justify="space-between">
            <VStack align="start" gap={0}>
              <Dialog.Title>Detalhes da Simulação</Dialog.Title>
              <Text fontSize="sm" color="gray.500">ID: {simulation.id.substring(0, 8)}...</Text>
            </VStack>
            <Badge colorPalette={statusColor}>{statusLabel}</Badge>
          </HStack>
          <Dialog.CloseTrigger />
        </Dialog.Header>

        <Dialog.Body>
          <VStack gap={6} align="stretch">
            {/* Resumo */}
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">VALOR DO EMPRÉSTIMO</Text>
                <Text fontSize="xl" fontWeight="bold">{loanSimulationService.formatCurrency(simulation.amount)}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">VALOR DA PARCELA</Text>
                <Text fontSize="xl" fontWeight="bold">{loanSimulationService.formatCurrency(simulation.installmentAmount)}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">PRAZO</Text>
                <Text fontSize="xl" fontWeight="bold">{simulation.termMonths} meses</Text>
              </GridItem>
            </Grid>

            <Separator />

            {/* Detalhes Financeiros */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <VStack align="start" gap={2}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Taxa de Juros:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatPercentage(simulation.interestRateMonthly)} a.m.</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Total de Juros:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatCurrency(simulation.totalInterest)}</Text>
                </HStack>
                <HStack justify="space-between" w="full" pt={1}>
                  <Text fontSize="sm" fontWeight="bold">Custo Total:</Text>
                  <Text fontWeight="bold">{loanSimulationService.formatCurrency(simulation.totalCost)}</Text>
                </HStack>
              </VStack>

              <VStack align="start" gap={2}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Uso da Reserva:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatPercentage(simulation.reserveUsagePercent)}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Reserva Restante:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatCurrency(simulation.reserveRemainingAmount)}</Text>
                </HStack>
                {simulation.status === 'PENDING' && (
                  <HStack justify="space-between" w="full" pt={1}>
                    <Text fontSize="sm">Expira em:</Text>
                    <Text fontWeight="medium" color={daysRemaining < 5 ? 'red.500' : 'inherit'}>{daysRemaining} dias</Text>
                  </HStack>
                )}
              </VStack>
            </Grid>

            <Box>
              <Text fontWeight="bold" mb={2}>Cronograma de Reposição</Text>
              <Box maxHeight="200px" overflowY="auto" border="1px solid" borderColor="border.subtle" borderRadius="md">
                <Table.Root size="sm" variant="outline" stickyHeader>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>#</Table.ColumnHeader>
                      <Table.ColumnHeader>Vencimento</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">Valor</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {simulation.installmentPlan?.map((item) => (
                      <Table.Row key={item.installmentNumber}>
                        <Table.Cell>{item.installmentNumber}</Table.Cell>
                        <Table.Cell>{loanSimulationService.formatDate(item.dueDate)}</Table.Cell>
                        <Table.Cell textAlign="right">{loanSimulationService.formatCurrency(item.totalAmount)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
          </VStack>
        </Dialog.Body>

        <Dialog.Footer gap={3}>
          {simulation.status === 'PENDING' && (
            <>
              <Button 
                variant="outline" 
                colorPalette="red" 
                onClick={handleDelete} 
                loading={deleteMutation.isPending}
              >
                <Trash2 size={16} /> Excluir
              </Button>
              <Button 
                onClick={handleApprove} 
                loading={approveMutation.isPending}
                disabled={daysRemaining <= 0}
              >
                <Check size={16} /> Aprovar Simulação
              </Button>
            </>
          )}
          
          {simulation.status === 'APPROVED' && (
            <Button 
              onClick={handleWithdraw} 
              loading={withdrawMutation.isPending}
              colorPalette="green"
            >
              <ArrowDownToLine size={16} /> Sacar Empréstimo
            </Button>
          )}

          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
