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
  Spinner,
  Center,


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
  useDeleteLoanSimulation,
  useLoanSimulation
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
  
  // Busca dados completos da simulação quando o dialog está aberto
  const { data: fullSimulation, isLoading } = useLoanSimulation(simulation?.id ?? undefined);
  
  // Usa dados completos se disponíveis, caso contrário usa os dados passados por prop
  const displaySimulation = fullSimulation ?? simulation;

  if (!displaySimulation) return null;
  
  // Mostra loading enquanto busca dados completos
  if (isLoading && open) {
    return (
      <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="xl">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="var(--card)" borderRadius="2xl" maxW="2xl">
            <Dialog.Header>
              <Dialog.Title>Detalhes da Simulação</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Center py={10}>
                <Spinner size="xl" colorPalette="brand" />
              </Center>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    );
  }

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(displaySimulation.id);
      onSuccess?.();
    } catch {
      // Ignore error as it's handled by the mutation
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync(displaySimulation.id);
      onSuccess?.();
    } catch {
      // Ignore error as it's handled by the mutation
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta simulação?')) {
      try {
        await deleteMutation.mutateAsync(displaySimulation.id);
        onOpenChange(false);
        onSuccess?.();
      } catch {
        // Ignore error as it's handled by the mutation
      }
    }
  };

  const statusLabel = LOAN_SIMULATION_STATUS_LABELS[displaySimulation.status];
  const statusColor = LOAN_SIMULATION_STATUS_COLORS[displaySimulation.status];
  const daysRemaining = loanSimulationService.getDaysUntilExpiration(displaySimulation);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="var(--card)" borderRadius="2xl" maxW="2xl">
          <Dialog.Header>
          <HStack justify="space-between">
            <VStack align="start" gap={0}>
              <Dialog.Title>Detalhes da Simulação</Dialog.Title>
              <Text fontSize="sm" color="gray.500">ID: {displaySimulation.id.substring(0, 8)}...</Text>
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
                <Text fontSize="xl" fontWeight="bold">{loanSimulationService.formatCurrency(displaySimulation.amount)}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">VALOR DA PARCELA</Text>
                <Text fontSize="xl" fontWeight="bold">{loanSimulationService.formatCurrency(displaySimulation.installmentAmount)}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">PRAZO</Text>
                <Text fontSize="xl" fontWeight="bold">{displaySimulation.termMonths} meses</Text>
              </GridItem>
            </Grid>

            <Separator />

            {/* Detalhes Financeiros */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <VStack align="start" gap={2}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Taxa de Juros:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatPercentage(displaySimulation.interestRateMonthly)} a.m.</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Total de Juros:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatCurrency(displaySimulation.totalInterest)}</Text>
                </HStack>
                <HStack justify="space-between" w="full" pt={1}>
                  <Text fontSize="sm" fontWeight="bold">Custo Total:</Text>
                  <Text fontWeight="bold">{loanSimulationService.formatCurrency(displaySimulation.totalCost)}</Text>
                </HStack>
              </VStack>

              <VStack align="start" gap={2}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Uso da Reserva:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatPercentage(displaySimulation.reserveUsagePercent)}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm">Reserva Restante:</Text>
                  <Text fontWeight="medium">{loanSimulationService.formatCurrency(displaySimulation.reserveRemainingAmount)}</Text>
                </HStack>
                {displaySimulation.status === 'PENDING' && (
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
                      <Table.ColumnHeader textAlign="right">Principal</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">Juros</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">Total</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="right">Saldo Restante</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {displaySimulation.installmentPlan?.map((item) => (
                      <Table.Row key={item.installmentNumber}>
                        <Table.Cell>{item.installmentNumber}</Table.Cell>
                        <Table.Cell textAlign="right">{loanSimulationService.formatCurrency(item.principalAmount)}</Table.Cell>
                        <Table.Cell textAlign="right">{loanSimulationService.formatCurrency(item.interestAmount)}</Table.Cell>
                        <Table.Cell textAlign="right">{loanSimulationService.formatCurrency(item.totalAmount)}</Table.Cell>
                        <Table.Cell textAlign="right">{loanSimulationService.formatCurrency(item.remainingPrincipal)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
          </VStack>
        </Dialog.Body>

        <Dialog.Footer gap={3}>
          {displaySimulation.status === 'PENDING' && (
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

          {displaySimulation.status === 'APPROVED' && (
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
