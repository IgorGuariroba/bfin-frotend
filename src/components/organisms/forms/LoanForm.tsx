import { VStack, Box, Text } from '@chakra-ui/react';
import { DollarSign } from 'lucide-react';
import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { MonetaryValueInput } from '../../molecules/MonetaryValueInput';
import { LoanFormFields } from '../../molecules/LoanFormFields';
import { LoanSimulationsList } from '../../molecules/LoanSimulationsList';
import { LoanSimulationDetailsDialog } from '../dialogs/LoanSimulationDetailsDialog';
import { useAccounts } from '../../../hooks/useAccounts';
import { useLoanSimulations, useLoanSimulation } from '../../../hooks/useLoanSimulations';
import { useLoanFormState } from '../../../hooks/useLoanFormState';
import { useLoanFormSubmission } from '../../../hooks/useLoanFormSubmission';
import { useLoanSimulationActions } from '../../../hooks/useLoanSimulationActions';

interface LoanFormProps {
  onCancel?: () => void;
}

export function LoanForm({ onCancel }: LoanFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data } = useLoanSimulations();

  const formState = useLoanFormState();

  const handleFormReset = () => {
    formState.form.reset({
      amount: 500,
      termMonths: 12,
      interestRateMonthly: 2.5,
    });
    formState.actions.handleAmountChange('500');
  };

  const { submitLoanSimulation, isSubmitting, error, isError } = useLoanFormSubmission({
    onSuccess: onCancel,
    onFormReset: handleFormReset,
  });

  const simulationActions = useLoanSimulationActions();

  const { data: fullSimulation, isLoading: isLoadingSimulation } = useLoanSimulation(
    simulationActions.state.selectedSimulationId ?? undefined
  );

  const simulations = data?.simulations || [];

  // Renderizar estado sem contas
  if (!loadingAccounts && (!accounts || accounts.length === 0)) {
    return (
      <BaseForm
        title="Simular Empréstimo"
        variant="green-header"
        icon={DollarSign}
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
        title="Simular Empréstimo"
        subtitle="Calcule as condições do seu empréstimo"
        icon={DollarSign}
        variant="green-header"
        onBack={onCancel}
        isLoading={loadingAccounts}
        formId="loan-form"
        onSubmit={formState.form.handleSubmit(submitLoanSimulation)}
        displayValue={{
          inputContent: (
            <MonetaryValueInput
              value={formState.state.amountInputValue}
              onValueChange={formState.actions.handleAmountChange}
            />
          ),
        }}
      >
        <Box px={{ base: 4, md: 6 }} py={4}>
          <VStack gap={6} align="stretch">
            {/* Erro de valor */}
            {formState.form.formState.errors.amount && (
              <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="lg" p={3}>
                <Text fontSize="sm" color="red.600">{formState.form.formState.errors.amount.message}</Text>
              </Box>
            )}

            {/* Card de campos */}
            <Box bg="var(--card)" borderRadius="2xl" p={6} shadow="md">
              <LoanFormFields
                register={formState.form.register}
                errors={formState.form.formState.errors}
                monthlyPayment={formState.state.monthlyPayment}
                totalInterest={formState.state.totalInterest}
                totalAmount={formState.state.totalAmount}
                error={error}
                isError={isError}
              />
            </Box>

            {/* Botões de ação */}
            <VStack gap={3} pb={24}>
              <Button
                type="submit"
                form="loan-form"
                colorPalette="green"
                w="full"
                loading={isSubmitting}
              >
                Simular Empréstimo
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

        {/* Lista de Simulações */}
        <LoanSimulationsList
          simulations={simulations}
          onViewSimulation={simulationActions.actions.handleViewSimulation}
          onApproveSimulation={simulationActions.actions.handleApproveSimulation}
          onWithdrawSimulation={simulationActions.actions.handleWithdrawSimulation}
          onDeleteSimulation={simulationActions.actions.handleDeleteSimulation}
          isApproving={simulationActions.mutations.approveMutation.isPending}
          isWithdrawing={simulationActions.mutations.withdrawMutation.isPending}
          isDeleting={simulationActions.mutations.deleteMutation.isPending}
        />
      </BaseForm>

      <LoanSimulationDetailsDialog
        simulation={fullSimulation ?? null}
        open={simulationActions.state.isDetailsOpen}
        onOpenChange={simulationActions.actions.setIsDetailsOpen}
        isLoading={isLoadingSimulation}
        onSuccess={() => {
          simulationActions.actions.setIsDetailsOpen(false);
          simulationActions.actions.setSelectedSimulationId(null);
        }}
      />
    </>
  );
}
