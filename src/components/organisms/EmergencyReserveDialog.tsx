import {
  Box,
  Text,
  VStack,
  HStack,
  Heading,
  Dialog,
  List,
} from '@chakra-ui/react';
import { Shield } from 'lucide-react';
import { iconColors } from '../../theme';
import { formatCurrency } from '../../utils';
import { useEmergencyReserveInfo, FINANCIAL_CONSTANTS } from '../../hooks/useFinancialCalculations';

/**
 * Interface para props do EmergencyReserveDialog
 */
interface EmergencyReserveDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Dados estáticos para benefícios da reserva de emergência
 * Extrai dados hardcoded para constantes
 */
const EMERGENCY_RESERVE_BENEFITS = [
  'Proteção financeira para imprevistos',
  'Cobertura para emergências médicas',
  'Segurança em caso de perda de renda',
  'Reparos urgentes em casa ou veículo',
] as const;

/**
 * Componente de valor da reserva
 * Single Responsibility: exibir valor formatado
 */
function ReserveAmountDisplay({ amount, isLoading }: { amount: number; isLoading: boolean }) {
  return (
    <Box
      bg={{ base: 'blue.100', _dark: 'blue.900/30' }}
      borderWidth="1px"
      borderColor={{ base: 'blue.200', _dark: 'blue.700/50' }}
      borderRadius="lg"
      p={4}
    >
      <Text fontSize="sm" color={{ base: 'blue.700', _dark: 'blue.300' }} mb={2}>
        Sua reserva de emergência é calculada automaticamente como{' '}
        {(FINANCIAL_CONSTANTS.EMERGENCY_RESERVE_PERCENTAGE * 100).toFixed(0)}%{' '}
        de todas as receitas recebidas.
      </Text>
      <Text fontSize="3xl" fontWeight="bold" color={{ base: 'blue.600', _dark: 'blue.400' }}>
        {isLoading ? 'Carregando...' : formatCurrency(amount)}
      </Text>
    </Box>
  );
}

/**
 * Componente de lista de benefícios
 * Single Responsibility: exibir benefícios da reserva
 */
function ReserveBenefitsList() {
  return (
    <VStack gap={2} align="stretch" fontSize="sm" color={{ base: 'muted.fg', _dark: 'muted.fg' }}>
      <Heading size="sm" color={{ base: 'fg', _dark: 'fg' }}>
        Para que serve?
      </Heading>
      <List.Root pl={6} listStyleType="disc">
        {EMERGENCY_RESERVE_BENEFITS.map((benefit, index) => (
          <List.Item key={index}>{benefit}</List.Item>
        ))}
      </List.Root>
    </VStack>
  );
}

/**
 * Componente de explicação do funcionamento
 * Single Responsibility: explicar como funciona o cálculo
 */
function ReserveExplanation() {
  const spendingPercentage = (FINANCIAL_CONSTANTS.SPENDING_PERCENTAGE * 100).toFixed(0);
  const reservePercentage = (FINANCIAL_CONSTANTS.EMERGENCY_RESERVE_PERCENTAGE * 100).toFixed(0);

  return (
    <Box
      bg={{ base: 'muted', _dark: 'muted' }}
      borderRadius="lg"
      p={4}
      fontSize="xs"
      color={{ base: 'muted.fg', _dark: 'muted.fg' }}
    >
      <Text fontWeight="medium" color={{ base: 'fg', _dark: 'fg' }} mb={1}>
        Como funciona:
      </Text>
      <Text>
        A cada receita recebida, {reservePercentage}% é automaticamente separado para sua reserva de emergência.
        Os {spendingPercentage}% restantes ficam disponíveis para seus gastos do dia a dia.
      </Text>
    </Box>
  );
}

/**
 * Dialog de Reserva de Emergência
 * Responsabilidade única: exibir informações da reserva de emergência
 * Benefícios Clean Code:
 * - Single Responsibility: apenas UI da reserva
 * - Small Components: quebrado em componentes menores
 * - No Magic Numbers: usa constantes para percentuais
 * - Pure Components: componentes puros sem side effects
 * - Descriptive Names: nomes claros e específicos
 */
export function EmergencyReserveDialog({ isOpen, onClose }: EmergencyReserveDialogProps) {
  const { amount, isLoading } = useEmergencyReserveInfo();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <HStack>
              <Shield size={20} color={iconColors.info} />
              <Text>Reserva de Emergência</Text>
            </HStack>
          </Dialog.Header>

          <Dialog.Body pb={6}>
            <VStack gap={4} align="stretch">
              <ReserveAmountDisplay amount={amount} isLoading={isLoading} />
              <ReserveBenefitsList />
              <ReserveExplanation />
            </VStack>
          </Dialog.Body>

          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}