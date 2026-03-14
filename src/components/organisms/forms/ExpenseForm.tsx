import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Stack,
  HStack,
  VStack,
  Center,
  Text,
  Box,
  Input,
  NativeSelect,
  Field,
  Menu,
  IconButton,
  Checkbox
} from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useCreateExpense } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import { useCategories } from '../../../hooks/useCategories';
import type { CreateExpenseDTO } from '../../../types/transaction';
import { Pencil, Tag, Zap, Check, ChevronDown, Calendar, Plus, Clock } from 'lucide-react';
import { iconColors } from '../../../theme';
import { toast } from '../../../lib/toast';
import { CreateCategoryDialog } from '../dialogs/CreateCategoryDialog';
import type { Category } from '@igorguariroba/bfin-sdk/client';

const expenseSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  type: z.enum(['fixed', 'variable']),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.enum(['monthly', 'weekly', 'yearly']).optional(),
  recurrenceInterval: z.number().min(1).max(12).optional().nullable(),
  indefinite: z.boolean().optional(),
  recurrenceCount: z.number().min(1).max(60).optional().nullable(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultType?: 'fixed' | 'variable';
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export function ExpenseForm({ onSuccess, onCancel, defaultType = 'variable' }: ExpenseFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [expenseType, setExpenseType] = useState<'fixed' | 'variable'>(defaultType);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      accountId: '',
      amount: 0,
      type: defaultType,
      isRecurring: false,
      indefinite: false,
    },
  });

  const amount = watch('amount') || 0;
  const selectedAccountId = watch('accountId');
  const isRecurring = watch('isRecurring');
  const [isEditingAmount, setIsEditingAmount] = useState(false);

  // Busca categorias apenas quando uma conta estiver selecionada
  const { data: allCategories, isLoading: loadingCategories } = useCategories(selectedAccountId);
  const createExpense = useCreateExpense();

  // Filtra apenas categorias do tipo 'expense'
  const categories = allCategories?.filter((category) => category.type === 'expense');

  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  // Define a conta padrão quando as contas forem carregadas
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('accountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedAccountId, setValue]);

  // Atualiza o tipo quando defaultType mudar
  useEffect(() => {
    setExpenseType(defaultType);
    setValue('type', defaultType);
  }, [defaultType, setValue]);

  const handleCategoryCreated = (newCategory: Category) => {
    if (newCategory.id) {
      setValue('categoryId', newCategory.id, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Converte data e hora para ISO 8601 datetime completo
      let dueDateIso: string | undefined;
      if (data.dueDate && data.type === 'fixed') {
        const time = data.dueTime || '00:00';
        // Combina data e hora no formato ISO 8601
        dueDateIso = new Date(`${data.dueDate}T${time}:00.000Z`).toISOString();
      }
      
      const payload: CreateExpenseDTO = {
        accountId: data.accountId,
        amount: Number(data.amount),
        description: data.description,
        categoryId: data.categoryId,
        type: data.type,
        dueDate: dueDateIso,
        isRecurring: data.isRecurring,
        recurrencePattern: data.isRecurring ? (data.recurrencePattern || 'monthly') : undefined,
        recurrenceInterval: data.recurrenceInterval ?? undefined,
        indefinite: data.indefinite,
        recurrenceCount: data.recurrenceCount ?? undefined,
      };

      await createExpense.mutateAsync(payload);

      toast.success(data.type === 'fixed' ? 'Despesa fixa criada com sucesso!' : 'Despesa variável criada com sucesso!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Erro ao criar despesa');
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const normalizeDigits = (value: string) => value.replace(/\D/g, '');

  const formatMoneyFromDigits = (digitsValue: string) => {
    const numeric = Number.parseInt(digitsValue || '0', 10);
    return formatNumber(numeric / 100);
  };

  const toAmountFromDigits = (digitsValue: string) => {
    const numeric = Number.parseInt(digitsValue || '0', 10);
    return numeric / 100;
  };

  const isFixed = expenseType === 'fixed';

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={0} align="stretch" minH="100vh" pb={8}>
          {/* Valor em destaque no header */}
          <Box mb={6}>
            {isEditingAmount ? (
              <Input
                type="text"
                inputMode="decimal"
                autoFocus
                value={amountInput}
                placeholder="0,00"
                fontSize="4xl"
                fontWeight="bold"
                color="var(--primary-foreground)"
                bg="transparent"
                border="none"
                borderBottom="2px solid var(--primary-foreground)"
                borderRadius="0"
                p={0}
                mb={4}
                onChange={(e) => {
                  const nextDigits = normalizeDigits(e.target.value);
                  setValue('amount', toAmountFromDigits(nextDigits), { shouldValidate: true });
                  setAmountInput(nextDigits ? formatMoneyFromDigits(nextDigits) : '');
                }}
                onBlur={(e) => {
                  const nextDigits = normalizeDigits(e.target.value);
                  const nextAmount = toAmountFromDigits(nextDigits);
                  setValue('amount', nextAmount, { shouldValidate: true });
                  setAmountInput(nextDigits ? formatMoneyFromDigits(nextDigits) : '');
                  setIsEditingAmount(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const nextDigits = normalizeDigits((e.target as HTMLInputElement).value);
                    const nextAmount = toAmountFromDigits(nextDigits);
                    setValue('amount', nextAmount, { shouldValidate: true });
                    setAmountInput(nextDigits ? formatMoneyFromDigits(nextDigits) : '');
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
                onClick={() => {
                  const digits = Math.round(Number(amount) * 100).toString();
                  setAmountInput(amount ? formatMoneyFromDigits(digits) : '');
                  setIsEditingAmount(true);
                }}
                _hover={{ opacity: 0.8 }}
              >
                {formatCurrency(Number(amount))}
              </Text>
            )}

            {/* Dropdown de Conta Customizado */}
            <Field.Root invalid={!!errors.accountId}>
              <input
                type="hidden"
                {...register('accountId')}
              />
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

          {/* Card branco com campos */}
          <Box
            bg="var(--card)"
            borderRadius="2xl"
            p={6}
            shadow="md"
            mt={4}
            mb={8}
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
                    placeholder="Ex: Supermercado, Aluguel..."
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

              {/* Checkbox Despesa Fixa */}
              <HStack justify="space-between" p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg">
                <HStack gap={2}>
                  <Clock size={18} color="var(--muted-foreground)" />
                  <Text fontSize="sm" fontWeight="medium" color="var(--muted-foreground)">
                    É despesa fixa?
                  </Text>
                </HStack>
                <Checkbox.Root
                  checked={isFixed}
                  onCheckedChange={(e) => {
                    const newType = e.checked ? 'fixed' : 'variable';
                    setExpenseType(newType);
                    setValue('type', newType);
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </HStack>

              {/* Campo Categoria com ícone */}
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

              {/* Campo Data e Hora de Vencimento (apenas para despesa fixa) */}
              {isFixed && (
                <Field.Root invalid={!!errors.dueDate}>
                  <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                    Data e Hora de Vencimento
                  </Field.Label>
                  <HStack gap={3}>
                    <Box position="relative" flex={1}>
                      <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                        <Calendar size={18} color="var(--muted-foreground)" />
                      </Box>
                      <Input
                        type="date"
                        {...register('dueDate', { required: isFixed ? 'Data de vencimento é obrigatória' : false })}
                        defaultValue={getTodayDate()}
                        pl={10}
                        borderColor="var(--border)"
                        borderRadius="full"
                        _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
                      />
                    </Box>
                    <Box position="relative" w="120px">
                      <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                        <Clock size={18} color="var(--muted-foreground)" />
                      </Box>
                      <Input
                        type="time"
                        {...register('dueTime')}
                        defaultValue="00:00"
                        pl={10}
                        borderColor="var(--border)"
                        borderRadius="full"
                        _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
                      />
                    </Box>
                  </HStack>
                  {errors.dueDate && (
                    <Field.ErrorText>{errors.dueDate.message}</Field.ErrorText>
                  )}
                </Field.Root>
              )}

              {/* Campo Recorrência (apenas para despesa fixa) */}
              {isFixed && (
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
                      onCheckedChange={(e) => setValue('isRecurring', !!e.checked)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </HStack>

                  {isRecurring && (
                    <VStack gap={3} align="stretch" pl={8}>
                      {/* Intervalo de Recorrência */}
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
                              _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
                            />
                            <NativeSelect.Root flex={1}>
                              <NativeSelect.Field
                                {...register('recurrencePattern')}
                                defaultValue="monthly"
                                borderColor="var(--border)"
                                borderRadius="full"
                                _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
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

                      {/* Checkbox Sem Data Fim */}
                      <HStack justify="space-between" p={3} bg="var(--card)" borderRadius="lg">
                        <HStack gap={2}>
                          <Clock size={16} color="var(--muted-foreground)" />
                          <Text fontSize="sm" color="var(--muted-foreground)">
                            Sem data fim (indeterminado)
                          </Text>
                        </HStack>
                        <Checkbox.Root
                          checked={watch('indefinite')}
                          onCheckedChange={(e) => setValue('indefinite', !!e.checked)}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </HStack>

                      {/* Quantidade de Vezes (apenas se não for indeterminado) */}
                      {!watch('indefinite') && (
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
                              _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
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
              )}

              {/* Campo Valor oculto para validação */}
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

              {/* Box informativo */}
              <Box
                bg={{ base: 'brand.50', _dark: 'brand.950' }}
                borderWidth="1px"
                borderColor={{ base: 'brand.200', _dark: 'brand.800' }}
                borderRadius="lg"
                p={4}
                mt={2}
              >
                <HStack gap={2} mb={3}>
                  <Zap size={18} color={iconColors.brandDark} />
                  <Text fontWeight="semibold" color={{ base: 'brand.700', _dark: 'brand.300' }} fontSize="sm">
                    Como funciona:
                  </Text>
                </HStack>
                <VStack gap={2} align="stretch" fontSize="sm" color="muted.fg">
                  <HStack gap={2}>
                    <Check size={16} color={iconColors.brandDark} />
                    <Text>O valor será <strong>debitado imediatamente</strong> da sua conta</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Check size={16} color={iconColors.brandDark} />
                    <Text>
                      {isFixed
                        ? 'Ideal para gastos fixos mensais (aluguel, assinatura)'
                        : 'Perfeito para gastos do dia a dia'}
                    </Text>
                  </HStack>
                  <HStack gap={2}>
                    <Check size={16} color={iconColors.brandDark} />
                    <Text>Reduz o saldo disponível na hora</Text>
                  </HStack>
                </VStack>
              </Box>

              {createExpense.isError && (
                <Box
                  bg={{ base: 'red.50', _dark: 'red.950' }}
                  borderWidth="1px"
                  borderColor={{ base: 'red.200', _dark: 'red.800' }}
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="sm" color={{ base: 'red.600', _dark: 'red.300' }}>
                    {createExpense.error instanceof Error
                      ? createExpense.error.message
                      : 'Erro ao criar despesa'}
                  </Text>
                </Box>
              )}

              {/* Botão de submit */}
              <Button
                type="submit"
                loading={isSubmitting || createExpense.isPending}
                w="full"
                size="lg"
                bg="var(--primary)"
                color="var(--primary-foreground)"
                borderRadius="full"
                _hover={{ opacity: 0.9 }}
                mt={4}
              >
                {isFixed ? 'Criar Despesa Fixa' : 'Criar Despesa Variável'}
              </Button>

              {/* Link Cancelar */}
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
                  pb={4}
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
        defaultType="expense"
        accountId={selectedAccountId || ''}
      />
    </>
  );
}
