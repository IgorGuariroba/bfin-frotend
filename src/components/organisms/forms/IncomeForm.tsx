import { VStack, Box, Text } from '@chakra-ui/react';
import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { MonetaryValueInput } from '../../molecules/MonetaryValueInput';
import { CreateCategoryDialog } from '../dialogs/CreateCategoryDialog';
import { TransactionSuccessModal } from '../modals/TransactionSuccessModal';
import { IncomeFormFields } from './IncomeFormFields';
import { useIncomeFormState } from '../../../hooks/useIncomeFormState';
import { useIncomeFormLogic } from '../../../hooks/useIncomeFormLogic';
import { TrendingUp } from 'lucide-react';

interface IncomeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IncomeForm({ onSuccess, onCancel }: IncomeFormProps) {
  const formState = useIncomeFormState();
  const logic = useIncomeFormLogic({
    actions: formState.actions,
    onSuccess
  });

  const { accounts, loadingAccounts } = logic;

  // Renderizar estado sem contas
  if (!loadingAccounts && (!accounts || accounts.length === 0)) {
    return (
      <BaseForm
        title="Adicionar Receita"
        variant="green-header"
        icon={TrendingUp}
        onBack={onCancel}
        formId="income-form"
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
        onSubmit={logic.form.handleSubmit}
        displayValue={{
          inputContent: (
            <MonetaryValueInput
              value={formState.amountInputValue}
              onValueChange={logic.handleAmountChange}
            />
          ),
        }}
      >
        <Box px={{ base: 4, md: 6 }} py={4}>
          <VStack gap={6} align="stretch">
            <IncomeFormFields
              register={logic.form.register}
              errors={logic.form.errors}
              watch={logic.form.watch}
              setValue={logic.form.setValue}
              accounts={logic.accounts}
              categories={logic.categories}
              selectedAccountId={logic.selectedAccountId}
              onAccountSelect={(accountId) => logic.form.setValue('accountId', accountId, { shouldValidate: true })}
              onCategoryDialogOpen={() => formState.actions.setIsCategoryDialogOpen(true)}
              createIncomeError={logic.createIncome.error}
            />

            {/* Botões de ação */}
            <VStack gap={3} pb={24}>
              <Button
                type="submit"
                form="income-form"
                colorPalette="green"
                w="full"
                loading={formState.buttonState === 'loading'}
                disabled={formState.buttonState === 'success'}
                aria-label={formState.buttonState === 'success' ? 'Depósito confirmado com sucesso' : 'Confirmar depósito de receita'}
              >
                {formState.buttonState === 'success' ? 'Depósito Confirmado!' : 'Confirmar Depósito'}
              </Button>
              {onCancel && (
                <Button
                  variant="ghost"
                  colorPalette="gray"
                  w="full"
                  onClick={onCancel}
                  aria-label="Cancelar criação de receita"
                >
                  Cancelar
                </Button>
              )}
            </VStack>
          </VStack>
        </Box>
      </BaseForm>

      {/* Dialog de Categoria */}
      <CreateCategoryDialog
        open={formState.isCategoryDialogOpen}
        onOpenChange={(e) => formState.actions.setIsCategoryDialogOpen(e.open)}
        onCategoryCreated={logic.handleCategoryCreated}
        defaultType="income"
        accountId={logic.selectedAccountId || ''}
      />

      {/* Modal de Confirmação */}
      <TransactionSuccessModal
        isOpen={formState.showConfirmationModal}
        onClose={logic.handleConfirmationClose}
        transaction={formState.createdTransaction}
        onNewTransaction={logic.handleNewTransaction}
        onBackToDashboard={() => {
          formState.actions.setShowConfirmationModal(false);
          formState.actions.setButtonState('idle');
          if (onSuccess) onSuccess();
        }}
        type="income"
      />
    </>
  );
}