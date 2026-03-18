import {
  VStack,
  HStack,
  Text,
  Input,
  NativeSelect,
  Field,
  Checkbox,
} from '@chakra-ui/react';
import { Clock } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { ExpenseFormData } from '../../hooks/useExpenseFormState';

interface RecurrenceSectionProps {
  isRecurring: boolean;
  indefinite: boolean;
  onRecurringChange: (isRecurring: boolean) => void;
  onIndefiniteChange: (indefinite: boolean) => void;
  register: UseFormRegister<ExpenseFormData>;
}

export function RecurrenceSection({
  isRecurring,
  indefinite,
  onRecurringChange,
  onIndefiniteChange,
  register,
}: RecurrenceSectionProps) {
  return (
    <VStack gap={3} align="stretch" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg">
      <HStack justify="space-between">
        <HStack gap={2}>
          <Clock size={18} color="var(--muted-foreground)" />
          <Text fontSize="sm" fontWeight="medium" color="var(--muted-foreground)">
            É recorrente?
          </Text>
        </HStack>
        <Checkbox.Root
          checked={isRecurring}
          onCheckedChange={(e) => onRecurringChange(!!e.checked)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </HStack>

      {isRecurring && (
        <VStack gap={3} align="stretch" pl={8}>
          <HStack gap={3}>
            <Field.Root flex={1}>
              <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                Repetir a cada
              </Field.Label>
              <HStack gap={2}>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  defaultValue="1"
                  placeholder="1"
                  {...register('recurrenceInterval', { valueAsNumber: true })}
                  borderColor="var(--border)"
                  borderRadius="full"
                  _focus={{
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 1px var(--primary)',
                  }}
                />
                <NativeSelect.Root flex={1}>
                  <NativeSelect.Field
                    {...register('recurrencePattern')}
                    defaultValue="monthly"
                    borderColor="var(--border)"
                    borderRadius="full"
                    _focus={{
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)',
                    }}
                  >
                    <option value="monthly">Mês(es)</option>
                    <option value="weekly">Semana(s)</option>
                    <option value="yearly">Ano(s)</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </HStack>
              <Text fontSize="xs" color="var(--muted-foreground)" mt={1}>
                Ex: 3 meses = trimestral
              </Text>
            </Field.Root>
          </HStack>

          <HStack justify="space-between" p={3} bg="var(--card)" borderRadius="lg">
            <HStack gap={2}>
              <Clock size={16} color="var(--muted-foreground)" />
              <Text fontSize="sm" color="var(--muted-foreground)">
                Sem data fim (indeterminado)
              </Text>
            </HStack>
            <Checkbox.Root
              checked={indefinite}
              onCheckedChange={(e) => onIndefiniteChange(!!e.checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
          </HStack>

          {!indefinite && (
            <Field.Root>
              <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                Repetir por quantas vezes?
              </Field.Label>
              <HStack gap={2}>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  placeholder="Ex: 5"
                  {...register('recurrenceCount', { valueAsNumber: true })}
                  borderColor="var(--border)"
                  borderRadius="full"
                  _focus={{
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 1px var(--primary)',
                  }}
                />
                <Text fontSize="sm" color="var(--muted-foreground)" whiteSpace="nowrap">
                  vezes
                </Text>
              </HStack>
              <Text fontSize="xs" color="var(--muted-foreground)" mt={1}>
                Deixe em branco para repetir até cancelar manualmente
              </Text>
            </Field.Root>
          )}
        </VStack>
      )}
    </VStack>
  );
}