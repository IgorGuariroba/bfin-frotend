import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, HStack, VStack, Center, Text, Box, Flex, Input, NativeSelect, Field } from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useCreateVariableExpense } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import { useCategories } from '../../../hooks/useCategories';
import type { CreateVariableExpenseDTO } from '../../../types/transaction';
import { Pencil, Tag, Zap, Check } from 'lucide-react';

const variableExpenseSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

type VariableExpenseFormData = z.infer<typeof variableExpenseSchema>;

interface VariableExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VariableExpenseForm({ onSuccess, onCancel }: VariableExpenseFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: categories, isLoading: loadingCategories } = useCategories('expense');
  const createVariableExpense = useCreateVariableExpense();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VariableExpenseFormData>({
    resolver: zodResolver(variableExpenseSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const amount = watch('amount') || 0;
  const [isEditingAmount, setIsEditingAmount] = useState(false);

  const onSubmit = async (data: VariableExpenseFormData) => {
    try {
      const payload: CreateVariableExpenseDTO = {
        ...data,
        amount: Number(data.amount),
      };

      await createVariableExpense.mutateAsync(payload);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating variable expense:', error);
    }
  };

  if (loadingAccounts || loadingCategories) {
    return (
      <Center py={4}>
        <Text>Carregando...</Text>
      </Center>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Center py={4}>
        <Stack gap={4} align="center">
          <Text color="gray.600">Você precisa criar uma conta primeiro.</Text>
          <Button onClick={onCancel}>Voltar</Button>
        </Stack>
      </Center>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={0} align="stretch">
        {/* Valor em destaque no header verde */}
        <Box mb={6}>
          {isEditingAmount ? (
            <Input
              type="number"
              step="0.01"
              autoFocus
              defaultValue={amount}
              fontSize="4xl"
              fontWeight="bold"
              color="var(--primary-foreground)"
              bg="transparent"
              border="none"
              borderBottom="2px solid var(--primary-foreground)"
              borderRadius="0"
              p={0}
              mb={4}
              onBlur={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setValue('amount', value);
                setIsEditingAmount(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = parseFloat((e.target as HTMLInputElement).value) || 0;
                  setValue('amount', value);
                  setIsEditingAmount(false);
                }
              }}
              css={{
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  display: 'none',
                },
              }}
            />
          ) : (
            <Text
              fontSize="4xl"
              fontWeight="bold"
              color="var(--primary-foreground)"
              mb={4}
              cursor="pointer"
              onClick={() => setIsEditingAmount(true)}
              _hover={{ opacity: 0.8 }}
            >
              {formatCurrency(Number(amount))}
            </Text>
          )}

          {/* Dropdown de Conta com borda branca */}
          <Field.Root invalid={!!errors.accountId}>
            <NativeSelect.Root>
              <NativeSelect.Field
                {...register('accountId')}
                placeholder="Selecione uma conta"
                borderWidth="2px"
                borderColor="var(--primary-foreground)"
                bg="transparent"
                color="var(--primary-foreground)"
                _placeholder={{ color: 'var(--primary-foreground)', opacity: 0.7 }}
                fontSize="md"
                py={3}
              >
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id} style={{ color: '#000' }}>
                    {account.account_name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator color="var(--primary-foreground)" />
            </NativeSelect.Root>
            {errors.accountId && (
              <Field.ErrorText color="var(--primary-foreground)">{errors.accountId.message}</Field.ErrorText>
            )}
          </Field.Root>
        </Box>

        {/* Card branco com campos */}
        <Box
          bg="var(--card)"
          borderRadius="2xl"
          p={6}
          shadow="md"
          mt={4}
        >
          <VStack gap={6} align="stretch">
            {/* Campo Descrição com ícone */}
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
                  placeholder="Ex: Supermercado, Uber..."
                  pl={10}
                  borderColor="var(--border)"
                  _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
                />
              </Box>
              {errors.description && (
                <Field.ErrorText>{errors.description.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Campo Categoria com ícone */}
            <Field.Root invalid={!!errors.categoryId}>
              <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                Categoria
              </Field.Label>
              <Box position="relative">
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                  <Tag size={18} color="var(--muted-foreground)" />
                </Box>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...register('categoryId')}
                    placeholder="Selecione uma categoria"
                    pl={10}
                    borderColor="var(--border)"
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
              {errors.categoryId && (
                <Field.ErrorText>{errors.categoryId.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Campo Valor oculto para validação do react-hook-form */}
            <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
              <Input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
              />
            </Box>

            {/* Mensagem de erro do valor (se houver) */}
            {errors.amount && (
              <Box
                bg="red.50"
                borderWidth="1px"
                borderColor="red.200"
                borderRadius="lg"
                p={3}
                mt={-4}
              >
                <Text fontSize="sm" color="red.600">{errors.amount.message}</Text>
              </Box>
            )}

            {/* Box informativo verde claro */}
            <Box
              bg="var(--primary-50)"
              borderWidth="1px"
              borderColor="var(--primary-200)"
              borderRadius="lg"
              p={4}
              mt={2}
            >
              <HStack gap={2} mb={3}>
                <Zap size={18} color="var(--primary-600)" />
                <Text fontWeight="semibold" color="var(--card-foreground)" fontSize="sm">
                  Como funciona:
                </Text>
              </HStack>
              <VStack gap={2} align="stretch" fontSize="sm" color="var(--muted-foreground)">
                <HStack gap={2}>
                  <Check size={16} color="var(--primary-600)" />
                  <Text>O valor será <strong>debitado imediatamente</strong> da sua conta</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color="var(--primary-600)" />
                  <Text>Perfeito para gastos do dia a dia</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color="var(--primary-600)" />
                  <Text>Reduz o saldo disponível na hora</Text>
                </HStack>
              </VStack>
            </Box>

            {createVariableExpense.isError && (
              <Box
                bg="red.50"
                borderWidth="1px"
                borderColor="red.200"
                borderRadius="lg"
                p={4}
              >
                <Text fontSize="sm" color="red.600">
                  {createVariableExpense.error instanceof Error
                    ? createVariableExpense.error.message
                    : 'Erro ao criar despesa variável'}
                </Text>
              </Box>
            )}

            {/* Botão verde grande */}
            <Button
              type="submit"
              loading={isSubmitting || createVariableExpense.isPending}
              w="full"
              size="lg"
              bg="var(--primary)"
              color="var(--primary-foreground)"
              _hover={{ opacity: 0.9 }}
              mt={4}
            >
              Criar Despesa Variável
            </Button>

            {/* Link Cancelar */}
            {onCancel && (
              <Text
                as="button"
                type="button"
                onClick={onCancel}
                textAlign="center"
                color="var(--primary-600)"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
                cursor="pointer"
              >
                Cancelar
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </form>
  );
}
