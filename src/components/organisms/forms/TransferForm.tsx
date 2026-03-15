import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HStack,
  VStack,
  Center,
  Text,
  Input,
  Field,
  Textarea,
} from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useCreateTransfer } from '../../../hooks/useTransactions';
import { useAccounts } from '../../../hooks/useAccounts';
import type { CreateTransferDTO } from '../../../types/transaction';
import { ArrowRight } from 'lucide-react';
import { toast } from '../../../lib/toast';

const transferSchema = z.object({
  sourceAccountId: z.string().min(1, 'Conta de origem é obrigatória'),
  destinationAccountId: z.string().min(1, 'Conta de destino é obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().max(255, 'Descrição deve ter no máximo 255 caracteres').optional().or(z.literal('')),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formatMoneyFromDigits = (digits: string): string => {
  const value = Number(digits) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const normalizeDigits = (value: string): string => {
  return value.replace(/\D/g, '');
};

const toAmountFromDigits = (digits: string): number => {
  return Number(digits) / 100;
};

export function TransferForm({ onSuccess, onCancel }: TransferFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const createTransfer = useCreateTransfer();
  const [isEditingAmount, setIsEditingAmount] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      description: '',
    },
  });

  const amount = watch('amount') || 0;
  const sourceAccountId = watch('sourceAccountId');
  const destinationAccountId = watch('destinationAccountId');

  const sourceAccount = accounts?.find((acc) => acc.id === sourceAccountId);

  const availableBalance = sourceAccount?.available_balance || 0;

  const onSubmit = async (data: TransferFormData) => {
    try {
      const payload: CreateTransferDTO = {
        sourceAccountId: data.sourceAccountId,
        destinationAccountId: data.destinationAccountId,
        amount: data.amount,
        description: data.description || undefined,
      };

      await createTransfer.mutateAsync(payload);

      toast.success('Transferência realizada com sucesso!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Erro ao realizar transferência';
      toast.error(message);
    }
  };

  if (loadingAccounts) {
    return (
      <Center py={8}>
        <Text>Carregando contas...</Text>
      </Center>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Center py={8}>
        <VStack gap={4}>
          <Text>Você não tem contas disponíveis.</Text>
          <Text fontSize="sm" color="var(--muted-foreground)">
            Crie uma conta primeiro.
          </Text>
        </VStack>
      </Center>
    );
  }

  if (accounts.length < 2) {
    return (
      <Center py={8}>
        <VStack gap={4}>
          <Text>Você precisa de pelo menos 2 contas para fazer uma transferência.</Text>
          <Text fontSize="sm" color="var(--muted-foreground)">
            Crie mais uma conta para continuar.
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      gap={4}
      p={4}
      align="stretch"
    >
      <VStack gap={2}>
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          Transferir Dinheiro
        </Text>
        <Text fontSize="sm" color="var(--muted-foreground)" textAlign="center">
          Transfira valores entre suas contas
        </Text>
      </VStack>

      {/* Valor */}
      <VStack gap={2} py={4}>
        {isEditingAmount ? (
          <Input
            type="text"
            inputMode="decimal"
            autoFocus
            value={amount ? formatMoneyFromDigits(Math.round(amount * 100).toString()) : ''}
            placeholder="0,00"
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
            border="none"
            borderBottom="2px solid var(--primary)"
            borderRadius="0"
            bg="transparent"
            color="var(--primary-foreground)"
            css={{
              '&:focus': {
                outline: 'none',
                borderColor: 'var(--primary)',
              },
            }}
            onChange={(e) => {
              const nextDigits = normalizeDigits(e.target.value);
              setValue('amount', toAmountFromDigits(nextDigits), { shouldValidate: true });
            }}
            onBlur={() => {
              setIsEditingAmount(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setIsEditingAmount(false);
              }
            }}
          />
        ) : (
          <Button
            type="button"
            variant="ghost"
            color="var(--primary-foreground)"
            bg="transparent"
            border="none"
            borderBottom="2px solid var(--primary-foreground)"
            borderRadius="0"
            p={0}
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
            mb={4}
            cursor="pointer"
            onClick={() => setIsEditingAmount(true)}
            _hover={{ opacity: 0.8 }}
          >
            {amount > 0
              ? formatMoneyFromDigits(Math.round(amount * 100).toString())
              : 'R$ 0,00'}
          </Button>
        )}
        {errors.amount && (
          <Text color="var(--destructive)" fontSize="sm">
            {errors.amount.message}
          </Text>
        )}
        {amount > availableBalance && (
          <Text color="var(--destructive)" fontSize="sm">
            Saldo insuficiente. Disponível: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableBalance || 0)}
          </Text>
        )}
      </VStack>

      {/* Conta de Origem */}
      <Field.Root invalid={!!errors.sourceAccountId}>
        <Field.Label>Conta de Origem</Field.Label>
        <select
          {...register('sourceAccountId')}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            background: 'var(--background)',
            color: 'var(--foreground)',
          }}
        >
          <option value="">Selecione a conta de origem</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.account_name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.available_balance || 0)}
            </option>
          ))}
        </select>
        <Field.ErrorText>{errors.sourceAccountId?.message}</Field.ErrorText>
      </Field.Root>

      {/* Ícone de seta */}
      <HStack justify="center" py={2}>
        <ArrowRight size={24} color="var(--muted-foreground)" />
      </HStack>

      {/* Conta de Destino */}
      <Field.Root invalid={!!errors.destinationAccountId}>
        <Field.Label>Conta de Destino</Field.Label>
        <select
          {...register('destinationAccountId')}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            background: 'var(--background)',
            color: 'var(--foreground)',
          }}
        >
          <option value="">Selecione a conta de destino</option>
          {accounts
            .filter((acc) => acc.id !== sourceAccountId)
            .map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_name}
              </option>
            ))}
        </select>
        <Field.ErrorText>{errors.destinationAccountId?.message}</Field.ErrorText>
      </Field.Root>

      {/* Descrição (opcional) */}
      <Field.Root invalid={!!errors.description}>
        <Field.Label>Descrição (opcional)</Field.Label>
        <Textarea
          {...register('description')}
          placeholder="Ex: Pagamento do jantar"
          rows={2}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            background: 'var(--background)',
            color: 'var(--foreground)',
            resize: 'vertical',
          }}
        />
        <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
      </Field.Root>

      {/* Botões de ação */}
      <HStack gap={3} pt={4}>
        <Button
          type="button"
          variant="outline"
          flex={1}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          flex={1}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            !sourceAccountId ||
            !destinationAccountId ||
            !amount ||
            amount > availableBalance
          }
        >
          Transferir
        </Button>
      </HStack>
    </VStack>
  );
}
