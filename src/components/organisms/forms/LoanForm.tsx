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
} from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import {
  Check,
  Zap,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  Percent,
} from 'lucide-react';
import { iconColors } from '../../../theme';
import { toast } from '../../../lib/toast';
import {
  createLoanSimulationSchema,
  type CreateLoanSimulationFormData,
  LOAN_SIMULATION_CONSTANTS,
} from '../../../types/loanSimulation';
import { useCreateLoanSimulation, useLoanSimulations } from '../../../hooks/useLoanSimulations';

interface LoanFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LoanForm({ onSuccess, onCancel }: LoanFormProps) {
  const createMutation = useCreateLoanSimulation();
  const { refetch: refetchSimulations } = useLoanSimulations();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
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

  // Calcular parcela estimada
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
      // Converter taxa de juros de porcentagem para decimal (ex: 2.5 -> 0.025)
      const submitData = {
        ...data,
        interestRateMonthly: data.interestRateMonthly / 100,
      };
      await createMutation.mutateAsync(submitData);

      // Atualizar lista de simulações
      await refetchSimulations();

      toast.success('Simulação criada com sucesso!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating loan simulation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={0} align="stretch" pb={8}>
        {/* Card Branco */}
        <Box
          bg="var(--card)"
          borderRadius="2xl"
          p={6}
          shadow="md"
          mx={6}
          mt={4}
        >
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
              bg={{ base: 'green.50', _dark: 'green.950' }}
              borderWidth="1px"
              borderColor={{ base: 'green.200', _dark: 'green.800' }}
              borderRadius="lg"
              p={4}
            >
              <HStack gap={2} mb={3}>
                <CheckCircle2 size={18} color={iconColors.success} />
                <Text fontWeight="semibold" color={{ base: 'green.700', _dark: 'green.300' }} fontSize="sm">
                  Como funciona:
                </Text>
              </HStack>
              <VStack gap={2} align="stretch" fontSize="sm" color="muted.fg">
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

            {/* Botão Simular */}
            <Button
              type="submit"
              loading={isSubmitting}
              w="full"
              size="lg"
              bg="var(--primary)"
              color="var(--primary-foreground)"
              borderRadius="full"
              mt={4}
            >
              <HStack gap={2}>
                <Clock size={18} />
                <Text>Simular Empréstimo</Text>
              </HStack>
            </Button>

            {/* Cancelar */}
            {onCancel && (
              <Text
                as="button"
                onClick={onCancel}
                textAlign="center"
                color="var(--primary)"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
                cursor="pointer"
                mt={2}
                css={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                Cancelar
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </form>
  );
}
