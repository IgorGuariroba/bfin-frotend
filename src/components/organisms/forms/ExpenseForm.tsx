import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HStack,
  VStack,
  Text,
  Box,
  Input,
  NativeSelect,
  Field,
  Menu,
  IconButton,
  Checkbox,
} from '@chakra-ui/react';
import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { useCreateExpense } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import { useCategories } from '../../../hooks/useCategories';
import type { CreateExpenseDTO } from '../../../types/transaction';
import { Pencil, Tag, Zap, Check, ChevronDown, Calendar, Plus, Clock, Receipt } from 'lucide-react';
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

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function ExpenseForm({ onSuccess, onCancel, defaultType = 'variable' }: ExpenseFormProps) {
  const { data: accounts, isLoading: loadingAccounts, refetchAccounts } = useAccounts();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [expenseType, setExpenseType] = useState<'fixed' | 'variable'>(defaultType);
  const [isEditingAmount, setIsEditingAmount] = useState(false);

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

  const { data: allCategories } = useCategories(selectedAccountId);
  const createExpense = useCreateExpense();

  const categories = allCategories?.filter((category) => category.type === 'expense');

  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('accountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedAccountId, setValue]);

  useEffect(() => {
    setExpenseType(defaultType);
    setValue('type', defaultType);
  }, [defaultType, setValue]);

  const handleCategoryCreated = (newCategory: Category) => {
    if (newCategory.id) {
      setValue('categoryId', newCategory.id, { shouldValidate: true });
    }
  };

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

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      let dueDateIso: string | undefined;
      if (data.dueDate && data.type === 'fixed') {
        const time = data.dueTime || '00:00';
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
      await refetchAccounts();

      toast.success(data.type === 'fixed' ? 'Despesa fixa criada com sucesso!' : 'Despesa variável criada com sucesso!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Erro ao criar despesa');
    }
  };

  if (!loadingAccounts && (!accounts || accounts.length === 0)) {
    return (
      <BaseForm
        title="Nova Despesa"
        variant="green-header"
        icon={Receipt}
        onBack={onCancel}
      >
        <Box px={{ base: 4, md: 6 }} py={8}>
          <VStack gap={4} align="center">
            <Text color="var(--muted-foreground)" fontSize="sm" textAlign="center">
              Você precisa criar uma conta primeiro.
            </Text>
            {onCancel && (
              <Button size="sm" variant="outline" onClick={onCancel}>
                Voltar
              </Button>
            )}
          </VStack>
        </Box>
      </BaseForm>
    );
  }

  return (
    <>
      <BaseForm
        title="Nova Despesa"
        subtitle={isFixed ? 'Despesa fixa' : 'Despesa variável'}
        icon={Receipt}
        variant="green-header"
        onBack={onCancel}
        isLoading={loadingAccounts}
        formId="expense-form"
        onSubmit={handleSubmit(onSubmit)}
        displayValue={{
          value: formatCurrency(Number(amount)),
          editable: !isEditingAmount,
          onEdit: () => setIsEditingAmount(true),
        }}
        primaryAction={{
          label: isFixed ? 'Criar Despesa Fixa' : 'Criar Despesa Variável',
          loading: isSubmitting || createExpense.isPending,
          colorPalette: 'green',
          onClick: () => {},
        }}
        actions={onCancel ? [{
          label: 'Cancelar',
          onClick: onCancel,
          variant: 'ghost',
          colorPalette: 'gray',
        }] : []}
        contentPb={24}
      >
        <Box px={{ base: 4, md: 6 }} py={4}>
          <VStack gap={6} align="stretch">
            {/* Input de edição do valor */}
            {isEditingAmount && (
              <Input
                type="text"
                inputMode="decimal"
                autoFocus
                value={amount ? formatMoneyFromDigits(Math.round(amount * 100).toString()) : ''}
                placeholder="0,00"
                fontSize="xl"
                fontWeight="bold"
                borderColor="var(--border)"
                borderRadius="full"
                _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
                onChange={(e) => {
                  const nextDigits = normalizeDigits(e.target.value);
                  setValue('amount', toAmountFromDigits(nextDigits), { shouldValidate: true });
                }}
                onBlur={() => setIsEditingAmount(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setIsEditingAmount(false);
                  }
                }}
                css={{
                  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                    display: 'none',
                  },
                }}
              />
            )}

            {/* Input oculto para o RHF */}
            <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
              <Input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
              />
            </Box>

            {errors.amount && (
              <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="lg" p={3}>
                <Text fontSize="sm" color="red.600">{errors.amount.message}</Text>
              </Box>
            )}

            {/* Seletor de Conta */}
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
                    color="var(--card-foreground)"
                    bg="var(--card)"
                    borderWidth="1px"
                    borderColor="var(--border)"
                    borderRadius="lg"
                    transition="all 0.2s"
                    _hover={{ borderColor: 'var(--primary)' }}
                    _focus={{
                      outline: 'none',
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)',
                    }}
                  >
                    <Text>
                      {selectedAccount ? selectedAccount.account_name : 'Selecione uma conta'}
                    </Text>
                    <ChevronDown size={20} />
                  </Box>
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content
                    maxH="300px"
                    overflowY="auto"
                    bg="var(--card)"
                    borderRadius="lg"
                    boxShadow="lg"
                    borderWidth="1px"
                    borderColor="var(--border)"
                    p={1}
                    css={{ zIndex: 'var(--z-dropdown)' }}
                  >
                    {accounts?.map((account) => (
                      <Menu.Item
                        key={account.id ?? ''}
                        value={account.id ?? ''}
                        onClick={() => setValue('accountId', account.id ?? '', { shouldValidate: true })}
                        px={3}
                        py={2}
                        borderRadius="md"
                        cursor="pointer"
                        bg={selectedAccountId === account.id ? 'var(--muted)' : 'transparent'}
                        _hover={{ bg: 'var(--muted)' }}
                      >
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="medium" color="var(--card-foreground)">
                            {account.account_name}
                          </Text>
                          {selectedAccountId === account.id && (
                            <Check size={16} color={iconColors.success} />
                          )}
                        </HStack>
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
              {errors.accountId && (
                <Field.ErrorText mt={2} fontSize="sm">
                  {errors.accountId.message}
                </Field.ErrorText>
              )}
            </Field.Root>

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

                {/* Toggle Despesa Fixa */}
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

                {/* Data e Hora de Vencimento (despesa fixa) */}
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
                          defaultValue={getCurrentTime()}
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

                {/* Recorrência (despesa fixa) */}
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

                {/* Info Box */}
                <Box
                  bg={{ base: 'brand.50', _dark: 'brand.950' }}
                  borderWidth="1px"
                  borderColor={{ base: 'brand.200', _dark: 'brand.800' }}
                  borderRadius="lg"
                  p={4}
                >
                  <HStack gap={2} mb={3}>
                    <Zap size={18} color={iconColors.brandDark} />
                    <Text fontWeight="semibold" color={{ base: 'brand.700', _dark: 'brand.300' }} fontSize="sm">
                      Como funciona:
                    </Text>
                  </HStack>
                  <VStack gap={2} align="stretch" fontSize="sm" color="var(--foreground)">
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

                {/* Erro da API */}
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
              </VStack>
            </Box>
          </VStack>
        </Box>
      </BaseForm>

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
