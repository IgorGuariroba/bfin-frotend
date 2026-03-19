import { VStack, Box } from '@chakra-ui/react';
import { Calculator, Calendar, Percent } from 'lucide-react';

import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { MonetaryValueInput } from '../../molecules/MonetaryValueInput';
import { FormInput } from '../../molecules/FormInput';
import { ApiErrorBox } from '../../molecules/ApiErrorBox';
import { loanSimulationService } from '../../../services/loanSimulationService';

import { useLoanSimulationFormState } from '../../../hooks/useLoanSimulationFormState';
import { useLoanSimulationSubmission } from '../../../hooks/useLoanSimulationSubmission';

import type { CreateLoanSimulationFormData } from '../../../types/loanSimulation';

interface LoanSimulationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<CreateLoanSimulationFormData>;
}

export function LoanSimulationForm({ onSuccess, onCancel, initialData }: LoanSimulationFormProps) {
  const {
    form: { register, handleSubmit, formState: { errors } },
    state: { amountInputValue },
    actions: { handleAmountChange },
    constants,
  } = useLoanSimulationFormState({ initialData });

  const { submitLoanSimulation, isSubmitting, error, isError } = useLoanSimulationSubmission({ onSuccess });

  return (
    <BaseForm
      title="Simular Empréstimo"
      subtitle="Use sua reserva de emergência como garantia"
      icon={Calculator}
      variant="green-header"
      onBack={onCancel}
      formId="loan-simulation-form"
      onSubmit={handleSubmit(submitLoanSimulation)}
      displayValue={{
        inputContent: (
          <MonetaryValueInput
            value={amountInputValue}
            onValueChange={handleAmountChange}
            placeholder="R$ 0,00"
            min={constants.MIN_AMOUNT}
          />
        ),
      }}
    >
      <Box px={{ base: 4, md: 6 }} py={4}>
        <VStack gap={6} align="stretch">
          {/* Erro de valor */}
          {errors.amount && (
            <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="lg" p={3}>
              <Box fontSize="sm" color="red.600">{errors.amount.message}</Box>
            </Box>
          )}

          {/* Card de campos */}
          <Box bg="var(--card)" borderRadius="2xl" p={6} shadow="md">
            <VStack gap={6} align="stretch">
              {/* Prazo em meses */}
              <FormInput
                {...register('termMonths', { valueAsNumber: true })}
                label="Prazo (meses)"
                type="number"
                placeholder={`${constants.MIN_TERM_MONTHS} - ${constants.MAX_TERM_MONTHS}`}
                icon={<Calendar size={18} color="var(--muted-foreground)" />}
                error={errors.termMonths?.message}
              />

              {/* Taxa de juros mensal */}
              <FormInput
                {...register('interestRateMonthly', { valueAsNumber: true })}
                label="Taxa de Juros Mensal (%)"
                type="number"
                step="0.01"
                placeholder="Ex: 2.5"
                icon={<Percent size={18} color="var(--muted-foreground)" />}
                error={errors.interestRateMonthly?.message}
              />

              {/* Input oculto para Valor */}
              <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
                <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
              </Box>

              {/* Informações auxiliares */}
              <Box bg="blue.50" borderWidth="1px" borderColor="blue.200" borderRadius="lg" p={4}>
                <VStack gap={2} align="stretch">
                  <Box fontSize="sm" fontWeight="medium" color="blue.700">
                    Informações sobre empréstimo
                  </Box>
                  <VStack gap={1} align="stretch" fontSize="xs" color="blue.600">
                    <Box>• Valor entre {loanSimulationService.formatCurrency(constants.MIN_AMOUNT)} e {loanSimulationService.formatCurrency(constants.MAX_AMOUNT)}</Box>
                    <Box>• Prazo entre {constants.MIN_TERM_MONTHS} e {constants.MAX_TERM_MONTHS} meses</Box>
                    <Box>• Sistema de amortização PRICE</Box>
                    <Box>• Garantia: até 70% da reserva de emergência</Box>
                  </VStack>
                </VStack>
              </Box>

              {/* Erro da API */}
              {isError && <ApiErrorBox error={error} />}
            </VStack>
          </Box>

          {/* Botões de ação */}
          <VStack gap={3} pb={24}>
            <Button
              type="submit"
              form="loan-simulation-form"
              colorPalette="green"
              w="full"
              loading={isSubmitting}
            >
              Simular Empréstimo
            </Button>
            {onCancel && (
              <Button
                variant="ghost"
                colorPalette="gray"
                w="full"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </VStack>
        </VStack>
      </Box>
    </BaseForm>
  );
}
