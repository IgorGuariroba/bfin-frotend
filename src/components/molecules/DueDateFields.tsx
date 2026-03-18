import { Box, HStack, Field } from '@chakra-ui/react';
import { Calendar, Clock } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import { FormInput } from './FormInput';
import { getTodayDate, getCurrentTime } from '../../utils/date';
import type { ExpenseFormData } from '../../hooks/useExpenseFormState';

interface DueDateFieldsProps {
  register: UseFormRegister<ExpenseFormData>;
  error?: string;
}

export function DueDateFields({ register, error }: DueDateFieldsProps) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
        Data e Hora de Vencimento
      </Field.Label>
      <HStack gap={3}>
        <Box flex={1}>
          <FormInput
            type="date"
            icon={<Calendar size={18} color="var(--muted-foreground)" />}
            defaultValue={getTodayDate()}
            {...register('dueDate', { required: 'Data de vencimento é obrigatória' })}
          />
        </Box>
        <Box w="120px">
          <FormInput
            type="time"
            icon={<Clock size={18} color="var(--muted-foreground)" />}
            defaultValue={getCurrentTime()}
            {...register('dueTime')}
          />
        </Box>
      </HStack>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}