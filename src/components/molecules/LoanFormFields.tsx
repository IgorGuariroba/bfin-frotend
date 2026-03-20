import { VStack, Box } from '@chakra-ui/react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { LoanTermInput } from './LoanTermInput';
import { InterestRateInput } from './InterestRateInput';
import { LoanSimulationSummary } from './LoanSimulationSummary';
import { LoanInfoBox } from './LoanInfoBox';
import { ApiErrorBox } from './ApiErrorBox';
import type { CreateLoanSimulationFormData } from '../../types/loanSimulation';

interface LoanFormFieldsProps {
  register: UseFormRegister<CreateLoanSimulationFormData>;
  errors: FieldErrors<CreateLoanSimulationFormData>;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  error?: Error | unknown;
  isError?: boolean;
}

export function LoanFormFields({
  register,
  errors,
  monthlyPayment,
  totalInterest,
  totalAmount,
  error,
  isError,
}: LoanFormFieldsProps) {
  return (
    <VStack gap={6} align="stretch">
      {/* Prazo */}
      <LoanTermInput
        register={register}
        error={errors.termMonths}
      />

      {/* Taxa de Juros */}
      <InterestRateInput
        register={register}
        error={errors.interestRateMonthly}
      />

      {/* Input oculto para Valor */}
      <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
        <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
      </Box>

      {/* Resumo da Simulação */}
      <LoanSimulationSummary
        monthlyPayment={monthlyPayment}
        totalInterest={totalInterest}
        totalAmount={totalAmount}
      />

      {/* Info Box */}
      <LoanInfoBox />

      {/* Erro da API */}
      {isError && <ApiErrorBox error={error} />}
    </VStack>
  );
}
