import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HStack,
  VStack,
  Center,
  Text,
  Box,
  Input,
  Field,
  Menu,
} from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useCreateTransfer } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import type { CreateTransferDTO } from '../../../types/transaction';
import {
  Check,
  ChevronDown,
  Tag,
  Zap,
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

  if (loadingAccounts) {
    return (
      <Center py={4}>
        <Text>Carregando...</Text>
      </Center>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Center py={4}>
        <VStack gap={4} align="center">
          <Text color="gray.600">Você precisa criar uma conta primeiro.</Text>
          <Button onClick={onCancel}>Voltar</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={4} align="stretch" pb={8}>
        {/* Valor */}
        <Box px={6}>
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

          {/* Dropdown de Conta */}
          <Field.Root invalid={!!errors.sourceAccountId}>
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
                  color="primary.fg"
                  bg="transparent"
                  borderWidth="1px"
                  borderColor="primary.fg"
                  borderRadius="full"
                  transition="all 0.2s"
                  css={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <Text color="primary.fg" truncate>
                    {sourceAccount
                      ? sourceAccount.account_name
                      : 'Selecione uma conta'}
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
                        onClick={() =>
                          setValue('sourceAccountId', account.id ?? '', { shouldValidate: true })
                        }
                        css={{
                          backgroundColor:
                            selectedSourceAccountId === account.id
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                        px={3}
                        py={2}
                      >
                        <Text fontSize="sm" color="var(--primary-foreground)" truncate>
                          {account.account_name}
                        </Text>
                      </Menu.Item>
                    ))}
                  </Box>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            {errors.sourceAccountId && (
              <Field.ErrorText color="var(--primary-foreground)" mt={2} fontSize="sm">
                {errors.sourceAccountId.message}
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
          mx={6}
          mt={4}
        >
          <VStack gap={6} align="stretch">
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

            {/* Botão Transferir */}
            <Button
              type="submit"
              loading={isSubmitting}
              w="full"
              size="lg"
              bg="var(--primary)"
              color="var(--primary-foreground)"
              borderRadius="full"
              mt={4}
            >
              Transferir
            </Button>

            {/* Cancelar */}
            {onCancel && (
              <Text
                as="button"
                onClick={onCancel}
                textAlign="center"
                color="var(--primary)"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
                cursor="pointer"
                mt={2}
                css={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
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
