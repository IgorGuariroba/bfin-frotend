import { VStack, Box, Text } from '@chakra-ui/react';
import { ArrowRightLeft, Tag } from 'lucide-react';
import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { useAccounts } from '../../../hooks/useAccounts';
import { MonetaryValueInput } from '../../molecules/MonetaryValueInput';
import { FormInput } from '../../molecules/FormInput';
import { AccountSelector } from '../../molecules/AccountSelector';
import { DestinationAccountInput } from '../../molecules/DestinationAccountInput';
import { TransferInfoBox } from '../../molecules/TransferInfoBox';
import { ApiErrorBox } from '../../molecules/ApiErrorBox';
import { useTransferFormState } from '../../../hooks/useTransferFormState';
import { useTransferSubmission } from '../../../hooks/useTransferSubmission';


interface TransferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}


export function TransferForm({ onSuccess, onCancel }: TransferFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();

  const {
    form: { register, handleSubmit, setValue, formState: { errors } },
    state: { amountInputValue, selectedSourceAccountId, amount, availableBalance },
    actions: { handleAmountChange },
  } = useTransferFormState({ accounts });

  const handleFormReset = () => {
    setValue('amount', 0);
    setValue('description', '');
    setValue('destinationAccountId', '');
    handleAmountChange('');
  };

  const { submitTransfer, isSubmitting, error, isError } = useTransferSubmission({
    onSuccess,
    availableBalance,
    onFormReset: handleFormReset,
  });

  const handleAccountSelect = (accountId: string) => {
    setValue('sourceAccountId', accountId, { shouldValidate: true });
  };

  // Renderizar estado sem contas
  if (!loadingAccounts && (!accounts || accounts.length === 0)) {
    return (
      <BaseForm
        title="Transferir"
        variant="green-header"
        icon={ArrowRightLeft}
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
    <BaseForm
      title="Transferir"
      variant="green-header"
      icon={ArrowRightLeft}
      isLoading={loadingAccounts}
      formId="transfer-form"
      onSubmit={handleSubmit(submitTransfer)}
      displayValue={{
        inputContent: (
          <MonetaryValueInput
            value={amountInputValue}
            onValueChange={handleAmountChange}
          />
        ),
      }}
    >
      <Box px={{ base: 4, md: 6 }} py={4}>
        <VStack gap={6} align="stretch">
          {/* Erro de valor */}
          {errors.amount && (
            <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="lg" p={3}>
              <Text fontSize="sm" color="red.600">{errors.amount.message}</Text>
            </Box>
          )}

          {/* Seleção de Conta de Origem */}
          <AccountSelector
            accounts={accounts}
            selectedAccountId={selectedSourceAccountId}
            onAccountSelect={handleAccountSelect}
            register={register}
            error={errors.sourceAccountId?.message}
            fieldName="sourceAccountId"
            placeholder="Selecione a conta de origem"
          />

          {/* Card de campos */}
          <Box bg="var(--card)" borderRadius="2xl" p={6} shadow="md">
            <VStack gap={6} align="stretch">
              {/* ID da Conta de Destino */}
              <DestinationAccountInput
                register={register}
                error={errors.destinationAccountId?.message}
              />

              {/* Descrição */}
              <FormInput
                {...register('description')}
                label="Descrição"
                placeholder="Ex: Pagamento jantar"
                icon={<Tag size={18} color="var(--muted-foreground)" />}
                error={errors.description?.message}
              />

              {/* Input oculto para Valor */}
              <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
                <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
              </Box>

              {/* Info Box */}
              <TransferInfoBox />

              {/* Erro da API */}
              {isError && <ApiErrorBox error={error} />}
            </VStack>
          </Box>

          {/* Botões de ação */}
          <VStack gap={3} pb={24}>
            <Button
              type="submit"
              form="transfer-form"
              colorPalette="green"
              w="full"
              loading={isSubmitting}
              disabled={!amount || amount <= 0 || !selectedSourceAccountId}
            >
              Transferir
            </Button>
            {onCancel && (
              <Button
                variant="ghost"
                colorPalette="gray"
                w="full"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </VStack>
        </VStack>
      </Box>
    </BaseForm>
  );
}
