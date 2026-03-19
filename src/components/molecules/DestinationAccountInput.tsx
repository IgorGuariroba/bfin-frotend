import { Input, Field } from '@chakra-ui/react';
import type { UseFormRegister } from 'react-hook-form';
import type { TransferFormData } from '../../hooks/useTransferFormState';

interface DestinationAccountInputProps {
  register: UseFormRegister<TransferFormData>;
  error?: string;
}

export function DestinationAccountInput({ register, error }: DestinationAccountInputProps) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
        ID da Conta de Destino
      </Field.Label>
      <Input
        {...register('destinationAccountId')}
        placeholder="Ex: 123e4567-e89b-12d3-a456-426614174000"
        borderColor="var(--border)"
        borderRadius="full"
        _focus={{
          borderColor: 'var(--primary)',
          boxShadow: '0 0 0 1px var(--primary)',
        }}
      />
      {error && (
        <Field.ErrorText>{error}</Field.ErrorText>
      )}
    </Field.Root>
  );
}