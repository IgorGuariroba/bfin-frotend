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
  Field,
  Menu,
} from '@chakra-ui/react';
import { BaseForm } from '../../ui/BaseForm';
import { useCreateTransfer } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import type { CreateTransferDTO } from '../../../types/transaction';
import {
  Check,
  ChevronDown,
  Tag,
  Zap,
  ArrowRightLeft,
} from 'lucide-react';
import { iconColors } from '../../../theme';
import { toast } from '../../../lib/toast';

const transferSchema = z.object({
  sourceAccountId: z.string().min(1, 'Conta de origem é obrigatória'),
  destinationAccountId: z.string().min(1, 'ID da conta de destino é obrigatório'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
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

export function TransferForm({ onSuccess, onCancel }: TransferFormProps) {
  const { data: accounts, isLoading: loadingAccounts, refetchAccounts } = useAccounts();
  const createTransfer = useCreateTransfer();

  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountId: '',
      destinationAccountId: '',
      amount: 0,
      description: '',
    },
  });

  const amount = watch('amount') || 0;
  const selectedSourceAccountId = watch('sourceAccountId');

  const sourceAccount = accounts?.find((acc) => acc.id === selectedSourceAccountId);
  const availableBalance = sourceAccount?.available_balance || 0;

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedSourceAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('sourceAccountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedSourceAccountId, setValue]);

  const onSubmit = async (data: TransferFormData) => {
    if (amount > availableBalance) {
      toast.error('Saldo insuficiente');
      return;
    }

    try {
      const payload: CreateTransferDTO = {
        sourceAccountId: data.sourceAccountId,
        destinationAccountId: data.destinationAccountId,
        amount: Number(data.amount),
        description: data.description,
      };

      await createTransfer.mutateAsync(payload);

      // Forçar atualização dos dados de accounts
      await refetchAccounts();

      toast.success('Transferência realizada com sucesso!');

      // Reset do formulário
      setValue('amount', 0);
      setAmountInput('');
      setValue('description', '');
      setValue('destinationAccountId', '');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Erro ao realizar transferência';
      toast.error(message);
    }
  };

  return (
    <BaseForm
      variant="green-header"
      title="Transferir"
      icon={ArrowRightLeft}
      isLoading={loadingAccounts}
      error={!accounts || accounts.length === 0 ? 'Você precisa criar uma conta primeiro.' : null}
      displayValue={{
        value: formatCurrency(Number(amount)),
        editable: true,
        onEdit: () => {
          const digits = Math.round(Number(amount) * 100).toString();
          setAmountInput(amount ? formatMoneyFromDigits(digits) : '');
          setIsEditingAmount(true);
        },
      }}
      formId="transfer-form"
      onSubmit={handleSubmit(onSubmit)}
      primaryAction={{
        label: 'Transferir',
        onClick: () => {},
        loading: isSubmitting,
        disabled: !amount || amount <= 0 || !selectedSourceAccountId,
      }}
      onCancel={onCancel}
    >
      {/* Card Branco com conteúdo */}
      {/* Modal/Overlay para edição de valor */}
      {isEditingAmount && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.500"
          zIndex={50}
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
        >
          <VStack gap={4} bg="white" borderRadius="lg" p={6} minW="300px">
            <Text fontSize="lg" fontWeight="bold">Editar Valor</Text>
            <Input
              type="text"
              inputMode="decimal"
              autoFocus
              value={amountInput}
              placeholder="0,00"
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              onChange={(e) => {
                const nextDigits = normalizeDigits(e.target.value);
                setValue('amount', toAmountFromDigits(nextDigits), { shouldValidate: true });
                setAmountInput(nextDigits ? formatMoneyFromDigits(nextDigits) : '');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const nextDigits = normalizeDigits((e.target as HTMLInputElement).value);
                  const nextAmount = toAmountFromDigits(nextDigits);
                  setValue('amount', nextAmount, { shouldValidate: true });
                  setAmountInput(nextDigits ? formatMoneyFromDigits(nextDigits) : '');
                  setIsEditingAmount(false);
                }
                if (e.key === 'Escape') {
                  setIsEditingAmount(false);
                }
              }}
            />
            <HStack gap={2}>
              <button
                onClick={() => setIsEditingAmount(false)}
                style={{
                  padding: '8px 16px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const nextDigits = normalizeDigits(amountInput);
                  const nextAmount = toAmountFromDigits(nextDigits);
                  setValue('amount', nextAmount, { shouldValidate: true });
                  setIsEditingAmount(false);
                }}
                style={{
                  padding: '8px 16px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
            </HStack>
          </VStack>
        </Box>
      )}

      <Box
        bg="var(--card)"
        borderRadius="2xl"
        p={6}
        shadow="md"
        mx={6}
        mt={4}
      >
        <VStack gap={6} align="stretch">
          {/* Seleção de Conta de Origem */}
          <Field.Root invalid={!!errors.sourceAccountId}>
            <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
              Conta de Origem
            </Field.Label>
            <input type="hidden" {...register('sourceAccountId')} />
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
                  color="var(--foreground)"
                  bg="var(--background)"
                  borderWidth="1px"
                  borderColor="var(--border)"
                  borderRadius="full"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: 'var(--primary)',
                  }}
                  _focus={{
                    outline: 'none',
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 1px var(--primary)',
                  }}
                >
                  <Text color="var(--foreground)" truncate>
                    {sourceAccount
                      ? sourceAccount.account_name
                      : 'Selecione uma conta'}
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
                  p={0}
                  css={{
                    zIndex: 'var(--z-dropdown)',
                  }}
                >
                  <Box
                    px={3}
                    py={2}
                    bg="var(--card)"
                    borderTopRadius="lg"
                    borderBottomWidth="1px"
                    borderBottomColor="var(--border)"
                  >
                    <HStack gap={2}>
                      <Check size={16} />
                      <Text fontSize="sm" fontWeight="bold">
                        Selecione uma conta
                      </Text>
                    </HStack>
                  </Box>

                  <Box py={1}>
                    {accounts?.map((account) => (
                      <Menu.Item
                        key={account.id ?? ''}
                        value={account.id ?? ''}
                        onClick={() =>
                          setValue('sourceAccountId', account.id ?? '', { shouldValidate: true })
                        }
                        css={{
                          backgroundColor:
                            selectedSourceAccountId === account.id
                              ? 'var(--muted)'
                              : 'transparent',
                          '&:hover': {
                            backgroundColor: 'var(--muted)',
                          },
                        }}
                        px={3}
                        py={2}
                      >
                        <Text fontSize="sm" truncate>
                          {account.account_name}
                        </Text>
                      </Menu.Item>
                    ))}
                  </Box>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            {errors.sourceAccountId && (
              <Field.ErrorText>{errors.sourceAccountId.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* ID da Conta de Destino */}
          <Field.Root invalid={!!errors.destinationAccountId}>
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
            {errors.destinationAccountId && (
              <Field.ErrorText>{errors.destinationAccountId.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* Descrição */}
          <Field.Root invalid={!!errors.description}>
            <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
              Descrição
            </Field.Label>
            <Box position="relative">
              <Box
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
              >
                <Tag size={18} color="var(--muted-foreground)" />
              </Box>
              <Input
                {...register('description')}
                placeholder="Ex: Pagamento jantar"
                pl={10}
                borderColor="var(--border)"
                borderRadius="full"
                _focus={{
                  borderColor: 'var(--primary)',
                  boxShadow: '0 0 0 1px var(--primary)',
                }}
              />
            </Box>
            {errors.description && (
              <Field.ErrorText>{errors.description.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* Input oculto para Valor */}
          <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
            <Input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
          </Box>

          {errors.amount && (
            <Box
              bg="red.50"
              borderWidth="1px"
              borderColor="red.200"
              borderRadius="lg"
              p={3}
            >
              <Text fontSize="sm" color="red.600">
                {errors.amount.message}
              </Text>
            </Box>
          )}

          {/* Info Box */}
          <Box
            bg={{ base: 'green.50', _dark: 'green.950' }}
            borderWidth="1px"
            borderColor={{ base: 'green.200', _dark: 'green.800' }}
            borderRadius="lg"
            p={4}
          >
            <HStack gap={2} mb={3}>
              <Zap size={18} color={iconColors.success} />
              <Text fontWeight="semibold" color={{ base: 'green.700', _dark: 'green.300' }} fontSize="sm">
                Como funciona:
              </Text>
            </HStack>
            <VStack gap={2} align="stretch" fontSize="sm" color="muted.fg">
              <HStack gap={2}>
                <Check size={16} color={iconColors.success} />
                <Text>O valor será transferido imediatamente</Text>
              </HStack>
              <HStack gap={2}>
                <Check size={16} color={iconColors.success} />
                <Text>Verifique o ID da conta de destino</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Erro API */}
          {createTransfer.isError && (
            <Box
              bg={{ base: 'red.50', _dark: 'red.950' }}
              borderWidth="1px"
              borderColor={{ base: 'red.200', _dark: 'red.800' }}
              borderRadius="lg"
              p={4}
            >
              <Text fontSize="sm" color={{ base: 'red.600', _dark: 'red.300' }}>
                {createTransfer.error instanceof Error
                  ? createTransfer.error.message
                  : 'Erro ao criar transferência'}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </BaseForm>
  );
}
