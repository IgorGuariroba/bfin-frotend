import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HStack, VStack, Box, Input, Field } from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { createLoanSimulationSchema, type CreateLoanSimulationFormData, LOAN_SIMULATION_CONSTANTS } from '../../../types/loanSimulation';
import { useCreateLoanSimulation } from '../../../hooks/useLoanSimulations';
import { loanSimulationService } from '../../../services/loanSimulationService';

interface LoanSimulationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<CreateLoanSimulationFormData>;
}

export function LoanSimulationForm({ onSuccess, onCancel, initialData }: LoanSimulationFormProps) {
  const createMutation = useCreateLoanSimulation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLoanSimulationFormData>({
    resolver: zodResolver(createLoanSimulationSchema),
    defaultValues: initialData || {
      amount: 1000,
      termMonths: 12,
      interestRateMonthly: 2.5,
    },
  });

  const onSubmit = async (data: CreateLoanSimulationFormData) => {
    try {
      await createMutation.mutateAsync(data);
      onSuccess?.();
    } catch {
      // Erro já tratado no hook useCreateLoanSimulation
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={6} align="stretch">
        <Field.Root invalid={!!errors.amount}>
          <Field.Label>Valor do Empréstimo</Field.Label>
          <Input 
            {...register('amount', { valueAsNumber: true })} 
            type="number" 
            placeholder={`R$ ${LOAN_SIMULATION_CONSTANTS.MIN_AMOUNT} - R$ ${LOAN_SIMULATION_CONSTANTS.MAX_AMOUNT}`} 
          />
          <Field.HelperText>Mínimo: {loanSimulationService.formatCurrency(LOAN_SIMULATION_CONSTANTS.MIN_AMOUNT)}</Field.HelperText>
          <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.termMonths}>
          <Field.Label>Prazo (meses)</Field.Label>
          <Input 
            {...register('termMonths', { valueAsNumber: true })} 
            type="number" 
            placeholder={`${LOAN_SIMULATION_CONSTANTS.MIN_TERM_MONTHS} - ${LOAN_SIMULATION_CONSTANTS.MAX_TERM_MONTHS}`} 
          />
          <Field.HelperText>Entre {LOAN_SIMULATION_CONSTANTS.MIN_TERM_MONTHS} e {LOAN_SIMULATION_CONSTANTS.MAX_TERM_MONTHS} meses</Field.HelperText>
          <Field.ErrorText>{errors.termMonths?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.interestRateMonthly}>
          <Field.Label>Taxa de Juros Mensal (%)</Field.Label>
          <Input 
            {...register('interestRateMonthly', { valueAsNumber: true })} 
            type="number" 
            step="0.01" 
            placeholder="Ex: 2.5" 
          />
          <Field.ErrorText>{errors.interestRateMonthly?.message}</Field.ErrorText>
        </Field.Root>

        <HStack gap={4} justify="flex-end">
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Simular
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
