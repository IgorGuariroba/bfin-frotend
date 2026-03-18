import { Box, Input, NumberInput } from '@chakra-ui/react';
import type { UseFormRegister } from 'react-hook-form';
import type { ExpenseFormData } from '../../hooks/useExpenseFormState';

interface AmountInputProps {
  amount: number;
  isEditing: boolean;
  onAmountChange: (value: number) => void;
  onEditingChange: (isEditing: boolean) => void;
  register: UseFormRegister<ExpenseFormData>;
  error?: string;
}

export function AmountInput({
  amount,
  isEditing,
  onAmountChange,
  onEditingChange,
  register,
  error,
}: AmountInputProps) {
  return (
    <>
      {/* Input de edição do valor */}
      {isEditing && (
        <NumberInput.Root
          defaultValue={amount.toString()}
          value={amount.toString()}
          onValueChange={(details) => {
            const numericValue = parseFloat(details.value) || 0;
            onAmountChange(numericValue);
          }}
          formatOptions={{
            style: "currency",
            currency: "BRL",
            currencyDisplay: "symbol",
          }}
          allowMouseWheel
          step={0.01}
          min={0}
        >
          <NumberInput.Control>
            <NumberInput.Input
              autoFocus
              placeholder="R$ 0,00"
              fontSize="xl"
              fontWeight="bold"
              borderColor="var(--border)"
              borderRadius="full"
              _focus={{
                borderColor: 'var(--primary)',
                boxShadow: '0 0 0 1px var(--primary)'
              }}
              onBlur={() => onEditingChange(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onEditingChange(false);
                }
              }}
            />
          </NumberInput.Control>
        </NumberInput.Root>
      )}

      {/* Input oculto para o RHF */}
      <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
        <Input
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
        />
      </Box>

      {error && (
        <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="lg" p={3}>
          <Box fontSize="sm" color="red.600">{error}</Box>
        </Box>
      )}
    </>
  );
}