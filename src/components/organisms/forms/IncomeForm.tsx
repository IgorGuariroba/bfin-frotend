import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, HStack, VStack, Center, Text, Box, Input, NativeSelect, Field, Menu, Checkbox, IconButton } from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useCreateIncome } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import { useCategories } from '../../../hooks/useCategories';
import type { CreateIncomeDTO } from '../../../types/transaction';
import { Pencil, Tag, Calendar, Check, ChevronDown, Zap, Plus } from 'lucide-react';
import { iconColors } from '../../../theme';
import { toast } from '../../../lib/toast';
import { CreateCategoryDialog } from '../dialogs/CreateCategoryDialog';
import type { Category } from '@igorguariroba/bfin-sdk/client';

const incomeSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  dueDate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return new Date(val).toISOString();
    }),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.enum(['monthly', 'weekly', 'yearly']).optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IncomeForm({ onSuccess, onCancel }: IncomeFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      accountId: '',
      amount: 0,
      isRecurring: false,
    },
  });

  const amount = watch('amount') || 0;
  const selectedAccountId = watch('accountId');

  // Busca categorias apenas quando uma conta estiver selecionada
  const { data: allCategories, isLoading: loadingCategories } = useCategories(selectedAccountId);
  const createIncome = useCreateIncome();

  // Filtra apenas categorias do tipo 'income'
  const categories = allCategories?.filter((category) => category.type === 'income');
  const [isEditingAmount, setIsEditingAmount] = useState(false);

  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('accountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedAccountId, setValue]);

  const handleCategoryCreated = (newCategory: Category) => {
    if (newCategory.id) {
      setValue('categoryId', newCategory.id, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: IncomeFormData) => {
    try {
      const payload: CreateIncomeDTO = {
        ...data,
        amount: Number(data.amount),
      };

      await createIncome.mutateAsync(payload);

      toast.success('Receita adicionada com sucesso!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating income:', error);
      toast.error('Erro ao adicionar receita');
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={0} align="stretch">
          {/* Header - Valor */}
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

            {/* Header - Conta */}
            <Field.Root invalid={!!errors.accountId}>
              <input type="hidden" {...register('accountId')} />
              <Menu.Root positioning={{ placement: 'bottom-start', sameWidth: true }}>
                <Menu.Trigger asChild>
                  <Box
                    as="button"
                    w="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={3}
                    fontSize="md"
                    fontWeight="medium"
                    color="primary.fg"
                    bg="var(--primary)"
                    borderWidth="1px"
                    borderColor="primary.fg"
                    borderRadius="full"
                    transition="all 0.2s"
                    css={{
                      '&:hover': {
                        backgroundColor: iconColors.brandDark,
                      },
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    <Text color="primary.fg">
                      {selectedAccount ? selectedAccount.account_name : 'Selecione uma conta'}
                    </Text>
                    <ChevronDown size={20} color={iconColors.primaryFg} />
                  </Box>
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content
                    maxH="300px"
                    overflowY="auto"
                    bg="var(--primary)"
                    borderRadius="lg"
                    boxShadow="lg"
                    borderWidth="1px"
                    borderColor="primary.fg"
                    p={0}
                    css={{
                      zIndex: 'var(--z-dropdown)',
                    }}
                  >
                    <Box
                      px={3}
                      py={2}
                      bg="var(--primary)"
                      borderTopRadius="lg"
                      borderBottomWidth="1px"
                      borderBottomColor="primary.fg"
                    >
                      <HStack gap={2}>
                        <Check size={16} color={iconColors.primaryFg} />
                        <Text fontSize="sm" fontWeight="bold" color="primary.fg">
                          Selecione uma conta
                        </Text>
                      </HStack>
                    </Box>

                    <Box py={1}>
                      {accounts?.map((account) => (
                        <Menu.Item
                          key={account.id ?? ''}
                          value={account.id ?? ''}
                          onClick={() => setValue('accountId', account.id ?? '', { shouldValidate: true })}
                          css={{
                            backgroundColor: selectedAccountId === account.id ? iconColors.brandDark : 'transparent',
                            '&:hover': {
                              backgroundColor: iconColors.brandDark,
                            },
                          }}
                          px={3}
                          py={2}
                        >
                          <Text fontSize="sm" color="var(--primary-foreground)">
                            {account.account_name}
                          </Text>
                        </Menu.Item>
                      ))}
                    </Box>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
              {errors.accountId && (
                <Field.ErrorText color="var(--primary-foreground)" mt={2} fontSize="sm">
                  {errors.accountId.message}
                </Field.ErrorText>
              )}
            </Field.Root>
          </Box>

          {/* Card Branco */}
          <Box
            bg="var(--card)"
            borderRadius="2xl"
            p={6}
            shadow="md"
            mt={4}
          >
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
                      setIsCategoryDialogOpen(true);
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

              {/* Data (Opcional) */}
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

              {/* Input oculto para Valor */}
              <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
                <Input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                />
              </Box>

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

              {/* Info Box */}
              <Box
                bg={{ base: 'green.50', _dark: 'green.950' }}
                borderWidth="1px"
                borderColor={{ base: 'green.200', _dark: 'green.800' }}
                borderRadius="lg"
                p={4}
                mt={2}
              >
                <HStack gap={2} mb={3}>
                  <Zap size={18} color={iconColors.success} />
                  <Text fontWeight="semibold" color={{ base: 'green.700', _dark: 'green.300' }} fontSize="sm">
                    Dica Financeira:
                  </Text>
                </HStack>
                <VStack gap={2} align="stretch" fontSize="sm" color="muted.fg">
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

              {/* Erro API */}
              {createIncome.isError && (
                <Box
                  bg={{ base: 'red.50', _dark: 'red.950' }}
                  borderWidth="1px"
                  borderColor={{ base: 'red.200', _dark: 'red.800' }}
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="sm" color={{ base: 'red.600', _dark: 'red.300' }}>
                    {createIncome.error instanceof Error
                      ? createIncome.error.message
                      : 'Erro ao criar receita'}
                  </Text>
                </Box>
              )}

              {/* Botão Salvar */}
              <Button
                type="submit"
                loading={isSubmitting || createIncome.isPending}
                w="full"
                size="lg"
                bg="var(--primary)"
                color="var(--primary-foreground)"
                borderRadius="full"
                _hover={{ opacity: 0.9 }}
                mt={4}
              >
                Confirmar Depósito
              </Button>

              {/* Cancelar */}
              {onCancel && (
                <Text
                  as="button"
                  onClick={onCancel}
                  textAlign="center"
                  color={iconColors.brandDark}
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

      <CreateCategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={(e) => setIsCategoryDialogOpen(e.open)}
        onCategoryCreated={handleCategoryCreated}
        defaultType="income"
        accountId={selectedAccountId || ''}
      />
    </>
  );
}
