import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  VStack,
  HStack,
  Text,
  Box,
  Input,
  NativeSelect,
  Field,
  Menu,
  Checkbox,
  IconButton,
  Dialog,
} from '@chakra-ui/react';
import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { MonetaryValueInput } from '../../molecules/MonetaryValueInput';
import { useCreateIncome } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import { useCategories } from '../../../hooks/useCategories';
import type { CreateIncomeDTO } from '../../../types/transaction';
import { Pencil, Tag, Calendar, Check, ChevronDown, Zap, Plus, CheckCircle2, TrendingUp } from 'lucide-react';
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

interface CreatedTransactionData {
  amount: number;
  description: string;
  accountName?: string;
  categoryName?: string;
  formattedAmount: string;
}

export function IncomeForm({ onSuccess, onCancel }: IncomeFormProps) {
  const { data: accounts, isLoading: loadingAccounts, refetchAccounts } = useAccounts();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [createdTransaction, setCreatedTransaction] = useState<CreatedTransactionData | null>(null);
  const [amountInputValue, setAmountInputValue] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      accountId: '',
      amount: 0,
      isRecurring: false,
    },
  });

  const selectedAccountId = watch('accountId');

  const { data: allCategories } = useCategories(selectedAccountId);
  const createIncome = useCreateIncome();

  const categories = allCategories?.filter((category) => category.type === 'income');

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

  const handleAmountChange = (value: string, valueAsNumber: number) => {
    setAmountInputValue(value);
    setValue('amount', valueAsNumber, { shouldValidate: true });
  };


  const onSubmit = async (data: IncomeFormData) => {
    setButtonState('loading');

    try {
      const payload: CreateIncomeDTO = {
        ...data,
        amount: Number(data.amount),
      };

      const result = await createIncome.mutateAsync(payload);

      await refetchAccounts();

      setCreatedTransaction({
        ...result,
        amount: Number(data.amount),
        description: data.description,
        accountName: selectedAccount?.account_name,
        categoryName: categories?.find(c => c.id === data.categoryId)?.name,
        formattedAmount: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Number(data.amount)),
      });

      setButtonState('success');

      setTimeout(() => {
        setShowConfirmationModal(true);
      }, 800);

      toast.success('Receita adicionada com sucesso!');

    } catch (error) {
      console.error('Error creating income:', error);
      toast.error('Erro ao adicionar receita');
      setButtonState('idle');
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    setButtonState('idle');

    setValue('amount', 0);
    setAmountInputValue('');
    setValue('description', '');
    setValue('categoryId', '');

    if (onSuccess) {
      setTimeout(() => onSuccess(), 300);
    }
  };

  if (!loadingAccounts && (!accounts || accounts.length === 0)) {
    return (
      <BaseForm
        title="Adicionar Receita"
        variant="green-header"
        icon={TrendingUp}
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
        title="Adicionar Receita"
        subtitle="Registre uma nova entrada"
        icon={TrendingUp}
        variant="green-header"
        onBack={onCancel}
        isLoading={loadingAccounts}
        formId="income-form"
        onSubmit={handleSubmit(onSubmit)}
        displayValue={{
          inputContent: (
            <MonetaryValueInput
              value={amountInputValue}
              onValueChange={handleAmountChange}
            />
          ),
        }}
        primaryAction={{
          label: buttonState === 'success' ? 'Depósito Confirmado!' : 'Confirmar Depósito',
          loading: buttonState === 'loading',
          disabled: buttonState === 'success',
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
            {/* Erro de valor */}
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
              </VStack>
            </Box>
          </VStack>
        </Box>
      </BaseForm>

      <CreateCategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={(e) => setIsCategoryDialogOpen(e.open)}
        onCategoryCreated={handleCategoryCreated}
        defaultType="income"
        accountId={selectedAccountId || ''}
      />

      {/* Modal de Confirmação */}
      <Dialog.Root open={showConfirmationModal} onOpenChange={(details: { open: boolean }) => setShowConfirmationModal(details.open)}>
        <Dialog.Backdrop
          bg="rgba(0, 0, 0, 0.5)"
          backdropFilter="blur(4px)"
        />
        <Dialog.Positioner>
          <Dialog.Content
            bg="var(--card)"
            borderRadius="2xl"
            p={0}
            maxW="md"
            w="90%"
            mx={4}
            css={{
              animation: 'slideInScale 0.3s ease-out',
              '@keyframes slideInScale': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px) scale(0.95)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0) scale(1)',
                },
              },
            }}
          >
            {/* Header Verde */}
            <Box
              bg="green.500"
              color="white"
              p={6}
              borderTopRadius="2xl"
              textAlign="center"
            >
              <VStack gap={3}>
                <Box
                  bg="white"
                  color="green.500"
                  borderRadius="full"
                  p={3}
                  css={{
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <CheckCircle2 size={32} />
                </Box>
                <VStack gap={1}>
                  <Text fontSize="xl" fontWeight="bold">
                    Depósito Confirmado!
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold">
                    {createdTransaction?.formattedAmount}
                  </Text>
                  <Text fontSize="sm" opacity={0.9}>
                    foi adicionado com sucesso
                  </Text>
                </VStack>
              </VStack>
            </Box>

            {/* Detalhes */}
            <Box p={6}>
              <VStack gap={4} align="stretch">
                <Text fontSize="lg" fontWeight="semibold" color="var(--foreground)">
                  Detalhes da Transação
                </Text>

                <VStack gap={3} align="stretch">
                  <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                    <Text color="var(--muted-foreground)">Conta:</Text>
                    <Text fontWeight="medium" color="var(--foreground)">
                      {createdTransaction?.accountName}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                    <Text color="var(--muted-foreground)">Categoria:</Text>
                    <Text fontWeight="medium" color="var(--foreground)">
                      {createdTransaction?.categoryName}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                    <Text color="var(--muted-foreground)">Descrição:</Text>
                    <Text fontWeight="medium" color="var(--foreground)">
                      {createdTransaction?.description}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" p={3} bg="var(--muted)" borderRadius="lg">
                    <Text color="var(--muted-foreground)">Data:</Text>
                    <Text fontWeight="medium" color="var(--foreground)">
                      {new Date().toLocaleDateString('pt-BR')}
                    </Text>
                  </HStack>
                </VStack>

                {/* Botões */}
                <VStack gap={3} mt={4}>
                  <Button
                    onClick={handleConfirmationClose}
                    w="full"
                    size="lg"
                    bg="green.500"
                    color="white"
                    borderRadius="full"
                    _hover={{ bg: 'green.600' }}
                  >
                    Novo Depósito
                  </Button>

                  <Button
                    onClick={() => {
                      setShowConfirmationModal(false);
                      setButtonState('idle');
                      if (onSuccess) onSuccess();
                    }}
                    variant="ghost"
                    size="sm"
                    color="var(--muted-foreground)"
                  >
                    Voltar ao Dashboard
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
}
