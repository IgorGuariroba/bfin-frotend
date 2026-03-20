import {
  VStack,
  HStack,
  Box,
  Text,
  Field,
  Input,
  NativeSelect,
  Checkbox,
  IconButton,
} from '@chakra-ui/react';
import { Pencil, Tag, Calendar, Check, Plus, Zap } from 'lucide-react';
import { AccountSelector } from '../../molecules/AccountSelector';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { Account, Category } from '@igorguariroba/bfin-sdk/client';
import { iconColors } from '../../../theme';
import { toast } from '../../../lib/toast';
import type { IncomeFormData } from '../../../hooks/useIncomeFormLogic';

interface IncomeFormFieldsProps {
  register: UseFormRegister<IncomeFormData>;
  errors: FieldErrors<IncomeFormData>;
  accounts?: Account[];
  categories?: Category[];
  selectedAccountId: string;
  onAccountSelect: (accountId: string) => void;
  onCategoryDialogOpen: () => void;
  createIncomeError?: Error | null;
}

export function IncomeFormFields({
  register,
  errors,
  accounts,
  categories,
  selectedAccountId,
  onAccountSelect,
  onCategoryDialogOpen,
  createIncomeError,
}: IncomeFormFieldsProps) {
  return (
    <VStack gap={6} align="stretch">
      {/* Erro de valor */}
      {errors.amount && (
        <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="lg" p={3}>
          <Text fontSize="sm" color="red.600">{errors.amount.message}</Text>
        </Box>
      )}

      {/* Seletor de Conta */}
      <AccountSelector
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onAccountSelect={onAccountSelect}
        register={register}
        error={errors.accountId?.message}
        fieldName="accountId"
      />

      {/* Card de campos */}
      <Box bg="var(--card)" borderRadius="2xl" p={6} shadow="md">
        <VStack gap={6} align="stretch">
          {/* Descrição */}
          <Field.Root invalid={!!errors.description}>
            <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
              Descrição
            </Field.Label>
            <Box position="relative">
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                <Pencil size={18} color="var(--muted-foreground)" />
              </Box>
              <Input
                {...register('description')}
                placeholder="Ex: Salário, Freelance..."
                pl={10}
                borderColor="var(--border)"
                borderRadius="full"
                _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
              />
            </Box>
            {errors.description && (
              <Field.ErrorText>{errors.description.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* Categoria */}
          <Field.Root invalid={!!errors.categoryId}>
            <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
              Categoria
            </Field.Label>
            <HStack gap={2}>
              <Box position="relative" flex={1}>
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                  <Tag size={18} color="var(--muted-foreground)" />
                </Box>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...register('categoryId')}
                    placeholder="Selecione uma categoria"
                    pl={10}
                    borderColor="var(--border)"
                    borderRadius="full"
                    _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
                  >
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
              <IconButton
                aria-label="Nova Categoria"
                onClick={() => {
                  if (!selectedAccountId) {
                    toast.error('Selecione uma conta primeiro');
                    return;
                  }
                  onCategoryDialogOpen();
                }}
                variant="outline"
                borderRadius="full"
                borderColor="var(--border)"
                disabled={!selectedAccountId}
              >
                <Plus size={18} />
              </IconButton>
            </HStack>
            {errors.categoryId && (
              <Field.ErrorText>{errors.categoryId.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* Data */}
          <Field.Root>
            <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
              Data de Recebimento (opcional)
            </Field.Label>
            <Box position="relative">
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                <Calendar size={18} color="var(--muted-foreground)" />
              </Box>
              <Input
                type="datetime-local"
                {...register('dueDate')}
                pl={10}
                borderColor="var(--border)"
                borderRadius="full"
                _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
              />
            </Box>
          </Field.Root>

          {/* Recorrente */}
          <Checkbox.Root {...register('isRecurring')} colorPalette="brand">
            <Checkbox.Control />
            <Checkbox.Label>Receita recorrente</Checkbox.Label>
          </Checkbox.Root>

          {/* Info Box */}
          <Box
            bg="var(--card)"
            borderWidth="1px"
            borderColor="var(--success-border)"
            borderRadius="lg"
            p={4}
          >
            <HStack gap={2} mb={3}>
              <Zap size={18} color={iconColors.success} />
              <Text fontWeight="semibold" color="var(--success)" fontSize="sm">
                Dica Financeira:
              </Text>
            </HStack>
            <VStack gap={2} align="stretch" fontSize="sm" color="var(--foreground)">
              <HStack gap={2}>
                <Check size={16} color={iconColors.success} />
                <Text>Registre todas as suas entradas</Text>
              </HStack>
              <HStack gap={2}>
                <Check size={16} color={iconColors.success} />
                <Text>Separe uma parte para sua reserva</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Erro da API */}
          {createIncomeError && (
            <Box
              bg={{ base: 'red.50', _dark: 'red.950' }}
              borderWidth="1px"
              borderColor={{ base: 'red.200', _dark: 'red.800' }}
              borderRadius="lg"
              p={4}
            >
              <Text fontSize="sm" color={{ base: 'red.600', _dark: 'red.300' }}>
                {createIncomeError?.message || 'Erro ao criar receita'}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}