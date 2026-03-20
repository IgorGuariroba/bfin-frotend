import { Box, VStack, HStack, Text, Badge, IconButton } from '@chakra-ui/react';
import {
  Eye,
  CheckCircle,
  ArrowDownToLine,
  Trash2,
  Clock,
  Percent,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import {
  LOAN_SIMULATION_STATUS_LABELS,
  LOAN_SIMULATION_STATUS_COLORS,
  type LoanSimulation,
} from '../../types/loanSimulation';

interface LoanSimulationCardProps {
  simulation: LoanSimulation;
  onClick?: (simulation: LoanSimulation) => void;
  onView?: (simulation: LoanSimulation) => void;
  onApprove?: (simulation: LoanSimulation) => void;
  onWithdraw?: (simulation: LoanSimulation) => void;
  onDelete?: (simulation: LoanSimulation) => void;
  isApproving?: boolean;
  isWithdrawing?: boolean;
  isDeleting?: boolean;
}

export function LoanSimulationCard({
  simulation,
  onClick,
  onView,
  onApprove,
  onWithdraw,
  onDelete,
  isApproving,
  isWithdrawing,
  isDeleting,
}: LoanSimulationCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box
      bg="var(--card)"
      borderRadius="lg"
      p={4}
      borderWidth="1px"
      borderColor="var(--border)"
      _hover={{ shadow: 'md', borderColor: 'var(--primary)' }}
      cursor={onClick ? 'pointer' : 'default'}
      onClick={() => onClick?.(simulation)}
    >
      <VStack gap={3} align="stretch">
        <HStack justify="space-between">
          <Badge colorPalette={LOAN_SIMULATION_STATUS_COLORS[simulation.status]} variant="subtle">
            {LOAN_SIMULATION_STATUS_LABELS[simulation.status]}
          </Badge>
          <Text fontSize="xs" color="gray.500">
            {new Date(simulation.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <VStack gap={0} align="start">
            <Text fontSize="xs" color="gray.500">Valor</Text>
            <Text fontWeight="bold" fontSize="lg" color="var(--foreground)">
              {formatCurrency(simulation.amount)}
            </Text>
          </VStack>
          <VStack gap={0} align="end">
            <Text fontSize="xs" color="gray.500">Parcelas</Text>
            <Text fontWeight="bold" color="var(--foreground)">
              {simulation.termMonths}x {formatCurrency(simulation.installmentAmount)}
            </Text>
          </VStack>
        </HStack>

        <HStack gap={3} fontSize="xs" color="gray.500">
          <HStack gap={1}>
            <Clock size={14} />
            <Text>{simulation.termMonths} meses</Text>
          </HStack>
          <HStack gap={1}>
            <Percent size={14} />
            <Text>{(simulation.interestRateMonthly * 100).toFixed(2)}% a.m.</Text>
          </HStack>
        </HStack>

        {(onView || onApprove || onWithdraw || onDelete) && (
          <HStack gap={2} pt={2} borderTop="1px solid" borderColor="var(--border)">
            {onView && (
              <Button
                size="sm"
                variant="ghost"
                flex="1"
                onClick={() => onView(simulation)}
              >
                <Eye size={16} /> Ver
              </Button>
            )}

            {simulation.status === 'PENDING' && onApprove && (
              <Button
                size="sm"
                variant="ghost"
                colorPalette="green"
                flex="1"
                onClick={() => onApprove(simulation)}
                loading={isApproving}
              >
                <CheckCircle size={16} /> Aprovar
              </Button>
            )}

            {simulation.status === 'PENDING' && onDelete && (
              <IconButton
                size="sm"
                variant="ghost"
                colorPalette="red"
                aria-label="Excluir"
                onClick={() => onDelete(simulation)}
                loading={isDeleting}
              >
                <Trash2 size={16} />
              </IconButton>
            )}

            {simulation.status === 'APPROVED' && onWithdraw && (
              <Button
                size="sm"
                colorPalette="green"
                flex="1"
                onClick={() => onWithdraw(simulation)}
                loading={isWithdrawing}
              >
                <ArrowDownToLine size={16} /> Sacar
              </Button>
            )}

            {simulation.status === 'COMPLETED' && (
              <Badge colorPalette="green" variant="subtle">
                <CheckCircle size={12} /> Concluído
              </Badge>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
