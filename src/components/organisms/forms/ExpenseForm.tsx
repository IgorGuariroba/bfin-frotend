import { VStack, Box, Text, NumberInput } from '@chakra-ui/react';
import { Receipt, Pencil } from 'lucide-react';

import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { useAccounts } from '../../../hooks/useAccounts';
import { useCategories } from '../../../hooks/useCategories';
import { CreateCategoryDialog } from '../dialogs/CreateCategoryDialog';

import { useExpenseFormState } from '../../../hooks/useExpenseFormState';
import { useExpenseSubmission } from '../../../hooks/useExpenseSubmission';

import { ExpenseAccountSelector } from '../../molecules/ExpenseAccountSelector';
import { FormInput } from '../../molecules/FormInput';
import { ExpenseTypeToggle } from '../../molecules/ExpenseTypeToggle';
import { CategorySelector } from '../../molecules/CategorySelector';
import { DueDateFields } from '../../molecules/DueDateFields';
import { RecurrenceSection } from '../../molecules/RecurrenceSection';
import { ExpenseInfoBox } from '../../molecules/ExpenseInfoBox';
import { ApiErrorBox } from '../../molecules/ApiErrorBox';

import type { Category } from '@igorguariroba/bfin-sdk/client';

interface ExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultType?: 'fixed' | 'variable';
}

export function ExpenseForm({ onSuccess, onCancel, defaultType = 'variable' }: ExpenseFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: allCategories } = useCategories();

  const {
    form: { register, handleSubmit, setValue, watch, formState: { errors } },
    state: {
      isCategoryDialogOpen,
      expenseType,
      amountInputValue,
      selectedAccountId,
      isRecurring
    },
    actions: {
      setIsCategoryDialogOpen,
      handleExpenseTypeChange,
      handleAmountChange
    }
  } = useExpenseFormState({ defaultType, accounts });

  const { submitExpense, isSubmitting, error, isError } = useExpenseSubmission({ onSuccess });

  const categories = allCategories?.filter((category) => category.type === 'expense');

  const handleCategoryCreated = (newCategory: Category) => {
    if (newCategory.id) {
      setValue('categoryId', newCategory.id, { shouldValidate: true });
    }
  };

  const handleAccountSelect = (accountId: string) => {
    setValue('accountId', accountId, { shouldValidate: true });
  };

  const isFixed = expenseType === 'fixed';

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
        onSubmit={handleSubmit(submitExpense)}
        displayValue={{
          inputContent: (
            <NumberInput.Root
              locale="pt-BR"
              value={amountInputValue}
              onValueChange={(details) => handleAmountChange(details.value, details.valueAsNumber)}
              formatOptions={{ style: 'currency', currency: 'BRL', currencyDisplay: 'symbol' }}
              allowMouseWheel
              step={0.01}
              min={0}
            >
              <NumberInput.Input
                placeholder="R$ 0,00"
                fontSize="4xl"
                fontWeight="bold"
                color="var(--primary-foreground)"
                textAlign="center"
                border="none"
                bg="transparent"
                _focus={{ boxShadow: 'none' }}
                _placeholder={{ color: 'whiteAlpha.700' }}
              />
            </NumberInput.Root>
          ),
        }}
        primaryAction={{
          label: isFixed ? 'Criar Despesa Fixa' : 'Criar Despesa Variável',
          loading: isSubmitting,
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
            <ExpenseAccountSelector
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onAccountSelect={handleAccountSelect}
              register={register}
              error={errors.accountId?.message}
            />

            {/* Card de campos */}
            <Box bg="var(--card)" borderRadius="2xl" p={6} shadow="md">
              <VStack gap={6} align="stretch">
                {/* Descrição */}
                <FormInput
                  {...register('description')}
                  label="Descrição"
                  placeholder="Ex: Supermercado, Aluguel..."
                  icon={<Pencil size={18} color="var(--muted-foreground)" />}
                  error={errors.description?.message}
                />

                {/* Toggle Despesa Fixa */}
                <ExpenseTypeToggle
                  isFixed={isFixed}
                  onToggle={(isFixed) => handleExpenseTypeChange(isFixed ? 'fixed' : 'variable')}
                />

                {/* Categoria */}
                <CategorySelector
                  categories={categories}
                  selectedAccountId={selectedAccountId}
                  onNewCategoryClick={() => setIsCategoryDialogOpen(true)}
                  register={register}
                  error={errors.categoryId?.message}
                />

                {/* Data e Hora de Vencimento (despesa fixa) */}
                {isFixed && (
                  <DueDateFields
                    register={register}
                    error={errors.dueDate?.message}
                  />
                )}

                {/* Recorrência (despesa fixa) */}
                {isFixed && (
                  <RecurrenceSection
                    isRecurring={isRecurring || false}
                    indefinite={watch('indefinite') || false}
                    onRecurringChange={(recurring) => setValue('isRecurring', recurring)}
                    onIndefiniteChange={(indefinite) => setValue('indefinite', indefinite)}
                    register={register}
                  />
                )}

                {/* Info Box */}
                <ExpenseInfoBox isFixed={isFixed} />

                {/* Erro da API */}
                {isError && <ApiErrorBox error={error} />}
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
