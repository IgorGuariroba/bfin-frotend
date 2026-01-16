import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, HStack, Checkbox } from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { FormField } from '../../molecules/FormField';
import { FormSelect } from '../../molecules/FormSelect';
import { InfoBox } from '../../molecules/InfoBox';
import { usePostApiV1Accounts } from '@igorguariroba/bfin-sdk/react-query';

const createAccountSchema = z.object({
  account_name: z.string().min(1, 'Nome da conta é obrigatório'),
  account_type: z.enum(['checking', 'savings', 'investment']).optional(),
  is_default: z.boolean().optional(),
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

interface CreateAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAccountForm({ onSuccess, onCancel }: CreateAccountFormProps) {
  const queryClient = useQueryClient();

  const createAccount = usePostApiV1Accounts({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        if (onSuccess) {
          onSuccess();
        }
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      account_type: 'checking',
      is_default: true,
    },
  });

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      await createAccount.mutateAsync({ data });
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <FormField
          label="Nome da Conta"
          placeholder="Ex: Conta Corrente, Nubank, etc."
          isRequired
          error={errors.account_name?.message}
          {...register('account_name')}
        />

        <FormSelect
          label="Tipo de Conta"
          {...register('account_type')}
        >
          <option value="checking">Conta Corrente</option>
          <option value="savings">Poupança</option>
          <option value="investment">Investimentos</option>
        </FormSelect>

        <Checkbox.Root {...register('is_default')} colorPalette="brand">
          <Checkbox.Control />
          <Checkbox.Label>Definir como conta padrão</Checkbox.Label>
        </Checkbox.Root>

        {createAccount.isError && (
          <InfoBox variant="error">
            Erro ao criar conta. Tente novamente.
          </InfoBox>
        )}

        <HStack gap={3} pt={4}>
          <Button
            type="submit"
            loading={isSubmitting || createAccount.isPending}
            flex="1"
          >
            Criar Conta
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
        </HStack>
      </Stack>
    </form>
  );
}
