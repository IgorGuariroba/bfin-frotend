import { Box, Field, Input } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { LOAN_SIMULATION_CONSTANTS } from '../../types/loanSimulation';
import type { CreateLoanSimulationFormData } from '../../types/loanSimulation';

interface LoanTermInputProps {
  register: UseFormRegister<CreateLoanSimulationFormData>;
  error?: FieldError;
}

export function LoanTermInput({ register, error }: LoanTermInputProps) {
  return (
    <Field.Root invalid={!!error}>
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
      <Field.HelperText fontSize="xs" mt={2} color="var(--muted-foreground)" opacity={0.8}>
        Entre {LOAN_SIMULATION_CONSTANTS.MIN_TERM_MONTHS} e {LOAN_SIMULATION_CONSTANTS.MAX_TERM_MONTHS} meses
      </Field.HelperText>
      {error && (
        <Field.ErrorText>{error.message}</Field.ErrorText>
      )}
    </Field.Root>
  );
}