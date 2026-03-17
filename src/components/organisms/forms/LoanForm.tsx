import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  VStack,
  Text,
  Field,
  Input,
  HStack,
  SimpleGrid,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import {
  Check,
  Zap,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  Percent,
  Eye,
  CheckCircle,
  ArrowDownToLine,
  Trash2,
} from 'lucide-react';
import { iconColors } from '../../../theme';
import { toast } from '../../../lib/toast';
import {
  createLoanSimulationSchema,
  type CreateLoanSimulationFormData,
  LOAN_SIMULATION_CONSTANTS,
  LOAN_SIMULATION_STATUS_LABELS,
  LOAN_SIMULATION_STATUS_COLORS,
  type LoanSimulation,
} from '../../../types/loanSimulation';
import {
  useCreateLoanSimulation,
  useLoanSimulations,
  useApproveLoanSimulation,
  useWithdrawLoanSimulation,
  useDeleteLoanSimulation,
  useLoanSimulation,
} from '../../../hooks/useLoanSimulations';
import { LoanSimulationDetailsDialog } from '../dialogs/LoanSimulationDetailsDialog';

interface LoanFormProps {
  onCancel?: () => void;
}

export function LoanForm({ onCancel }: LoanFormProps) {
  const createMutation = useCreateLoanSimulation();
  const approveMutation = useApproveLoanSimulation();
  const withdrawMutation = useWithdrawLoanSimulation();
  const deleteMutation = useDeleteLoanSimulation();
  const { data, refetch: refetchSimulations } = useLoanSimulations();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: fullSimulation, isLoading: isLoadingSimulation } = useLoanSimulation(selectedSimulationId ?? undefined);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateLoanSimulationFormData>({
    resolver: zodResolver(createLoanSimulationSchema),
    defaultValues: {
      amount: 1000,
      termMonths: 12,
      interestRateMonthly: 2.5,
    },
  });

  const amount = watch('amount') || 0;
  const termMonths = watch('termMonths') || 12;
  const interestRateMonthly = watch('interestRateMonthly') || 2.5;

  const calculateMonthlyPayment = () => {
    const rate = interestRateMonthly / 100;
    if (rate === 0) return amount / termMonths;
    const payment = (amount * rate) / (1 - Math.pow(1 + rate, -termMonths));
    return payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalAmount = monthlyPayment * termMonths;
  const totalInterest = totalAmount - amount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const onSubmit = async (data: CreateLoanSimulationFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        interestRateMonthly: data.interestRateMonthly / 100,
      };
      await createMutation.mutateAsync(submitData);
      await refetchSimulations();
      reset({
        amount: 1000,
        termMonths: 12,
        interestRateMonthly: 2.5,
      });
      toast.success('Simulação criada com sucesso!');
    } catch (error) {
      console.error('Error creating loan simulation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSimulation = (simulation: LoanSimulation) => {
    setSelectedSimulationId(simulation.id);
    setIsDetailsOpen(true);
  };

  const handleApproveSimulation = async (simulation: LoanSimulation) => {
    try {
      await approveMutation.mutateAsync(simulation.id);
      await refetchSimulations();
      toast.success('Simulação aprovada com sucesso!');
    } catch (error) {
      console.error('Error approving simulation:', error);
    }
  };

  const handleWithdrawSimulation = async (simulation: LoanSimulation) => {
    try {
      await withdrawMutation.mutateAsync(simulation.id);
      await refetchSimulations();
      toast.success('Empréstimo sacado com sucesso!');
    } catch (error) {
      console.error('Error withdrawing simulation:', error);
    }
  };

  const handleDeleteSimulation = async (simulation: LoanSimulation) => {
    if (confirm('Tem certeza que deseja excluir esta simulação?')) {
      try {
        await deleteMutation.mutateAsync(simulation.id);
        await refetchSimulations();
        toast.success('Simulação excluída com sucesso!');
      } catch (error) {
        console.error('Error deleting simulation:', error);
      }
    }
  };

  const simulations = data?.simulations || [];

  return (
    <>
      <BaseForm
        title="Simular Empréstimo"
        subtitle="Calcule as condições do seu empréstimo"
        icon={DollarSign}
        variant="green-header"
        onBack={onCancel}
        formId="loan-form"
        onSubmit={handleSubmit(onSubmit)}
        primaryAction={{
          label: "Simular Empréstimo",
          loading: isSubmitting,
          onClick: () => {},
        }}
        contentPb={24}
      >
        <Box px={{ base: 4, md: 6 }} py={4}>
          <VStack gap={6} align="stretch">
            {/* Valor */}
            <Field.Root invalid={!!errors.amount}>
              <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                Valor do Empréstimo
              </Field.Label>
              <Box position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={1}
                >
                  <DollarSign size={18} color="var(--muted-foreground)" />
                </Box>
                <Input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  placeholder="Ex: 5000"
                  pl={10}
                  borderColor="var(--border)"
                  borderRadius="full"
                  _focus={{
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 1px var(--primary)',
                  }}
                />
              </Box>
              <Field.HelperText fontSize="xs" mt={2}>
                Mínimo: {formatCurrency(LOAN_SIMULATION_CONSTANTS.MIN_AMOUNT)}
              </Field.HelperText>
              {errors.amount && (
                <Field.ErrorText>{errors.amount.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Prazo */}
            <Field.Root invalid={!!errors.termMonths}>
              <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                Prazo (meses)
              </Field.Label>
              <Box position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={1}
                >
                  <Calendar size={18} color="var(--muted-foreground)" />
                </Box>
                <Input
                  {...register('termMonths', { valueAsNumber: true })}
                  type="number"
                  placeholder="Ex: 12"
                  pl={10}
                  borderColor="var(--border)"
                  borderRadius="full"
                  _focus={{
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 1px var(--primary)',
                  }}
                />
              </Box>
              <Field.HelperText fontSize="xs" mt={2}>
                Entre {LOAN_SIMULATION_CONSTANTS.MIN_TERM_MONTHS} e {LOAN_SIMULATION_CONSTANTS.MAX_TERM_MONTHS} meses
              </Field.HelperText>
              {errors.termMonths && (
                <Field.ErrorText>{errors.termMonths.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Taxa de Juros */}
            <Field.Root invalid={!!errors.interestRateMonthly}>
              <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                Taxa de Juros Mensal (%)
              </Field.Label>
              <Box position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={1}
                >
                  <Percent size={18} color="var(--muted-foreground)" />
                </Box>
                <Input
                  {...register('interestRateMonthly', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="Ex: 2.5"
                  pl={10}
                  borderColor="var(--border)"
                  borderRadius="full"
                  _focus={{
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 1px var(--primary)',
                  }}
                />
              </Box>
              {errors.interestRateMonthly && (
                <Field.ErrorText>{errors.interestRateMonthly.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Resumo da Simulação */}
            <Box
              bg={{ base: 'blue.50', _dark: 'blue.950' }}
              borderWidth="1px"
              borderColor={{ base: 'blue.200', _dark: 'blue.800' }}
              borderRadius="lg"
              p={4}
            >
              <HStack gap={2} mb={3}>
                <Zap size={18} color={iconColors.primary} />
                <Text fontWeight="semibold" color={{ base: 'blue.700', _dark: 'blue.300' }} fontSize="sm">
                  Resumo da Simulação:
                </Text>
              </HStack>
              <VStack gap={2} align="stretch" fontSize="sm">
                <HStack justify="space-between">
                  <Text color="muted.fg">Parcela estimada:</Text>
                  <Text fontWeight="medium" color="var(--foreground)">
                    {formatCurrency(monthlyPayment)}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="muted.fg">Total de juros:</Text>
                  <Text fontWeight="medium" color="var(--foreground)">
                    {formatCurrency(totalInterest)}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="muted.fg">Valor total:</Text>
                  <Text fontWeight="medium" color="var(--foreground)">
                    {formatCurrency(totalAmount)}
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Info Box */}
            <Box
              bg="var(--card)"
              borderWidth="1px"
              borderColor="var(--success-border)"
              borderRadius="lg"
              p={4}
            >
              <HStack gap={2} mb={3}>
                <CheckCircle2 size={18} color={iconColors.success} />
                <Text fontWeight="semibold" color="var(--success)" fontSize="sm">
                  Como funciona:
                </Text>
              </HStack>
              <VStack gap={2} align="stretch" fontSize="sm" color="var(--foreground)">
                <HStack gap={2}>
                  <Check size={16} color={iconColors.success} />
                  <Text>Sua reserva de emergência é usada como garantia</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color={iconColors.success} />
                  <Text>Taxas de juros mais baixas que empréstimos tradicionais</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color={iconColors.success} />
                  <Text>Você continua com o rendimento da reserva</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Lista de Simulações */}
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
                <Box
                  key={simulation.id}
                  bg="var(--card)"
                  borderRadius="lg"
                  p={4}
                  borderWidth="1px"
                  borderColor="var(--border)"
                  _hover={{ shadow: 'md', borderColor: 'var(--primary)' }}
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

                    <HStack gap={2} pt={2} borderTop="1px solid" borderColor="var(--border)">
                      <Button
                        size="sm"
                        variant="ghost"
                        flex="1"
                        onClick={() => handleViewSimulation(simulation)}
                      >
                        <Eye size={16} /> Ver
                      </Button>

                      {simulation.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorPalette="green"
                            flex="1"
                            onClick={() => handleApproveSimulation(simulation)}
                            loading={approveMutation.isPending}
                          >
                            <CheckCircle size={16} /> Aprovar
                          </Button>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorPalette="red"
                            aria-label="Excluir"
                            onClick={() => handleDeleteSimulation(simulation)}
                            loading={deleteMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </>
                      )}

                      {simulation.status === 'APPROVED' && (
                        <Button
                          size="sm"
                          colorPalette="green"
                          flex="1"
                          onClick={() => handleWithdrawSimulation(simulation)}
                          loading={withdrawMutation.isPending}
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
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </BaseForm>

      <LoanSimulationDetailsDialog
        simulation={fullSimulation ?? null}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        isLoading={isLoadingSimulation}
        onSuccess={() => {
          refetchSimulations();
          setIsDetailsOpen(false);
          setSelectedSimulationId(null);
        }}
      />
    </>
  );
}
