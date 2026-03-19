import { Box, Field, Input } from '@chakra-ui/react';
import { Percent } from 'lucide-react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import type { CreateLoanSimulationFormData } from '../../types/loanSimulation';

interface InterestRateInputProps {
  register: UseFormRegister<CreateLoanSimulationFormData>;
  error?: FieldError;
}

export function InterestRateInput({ register, error }: InterestRateInputProps) {
  return (
    <Field.Root invalid={!!error}>
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
      {error && (
        <Field.ErrorText>{error.message}</Field.ErrorText>
      )}
    </Field.Root>
  );
}