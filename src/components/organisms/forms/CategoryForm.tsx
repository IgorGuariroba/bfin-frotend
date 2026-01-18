import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { VStack, Button, Stack } from '@chakra-ui/react';
import { FormField } from '../../molecules/FormField';
import { FormSelect } from '../../molecules/FormSelect';
import { useCreateCategory } from '../../../hooks/useCategories';
import { toast } from '../../../lib/toast';
import type { Category } from '@igorguariroba/bfin-sdk/client';

const categorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório'),
  type: z.enum(['income', 'expense']),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSuccess?: (category: Category) => void;
  onCancel?: () => void;
  defaultType?: 'income' | 'expense';
  accountId: string;
}

export function CategoryForm({ onSuccess, onCancel, defaultType = 'expense', accountId }: CategoryFormProps) {
  const createCategory = useCreateCategory();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: defaultType,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const response = await createCategory.mutateAsync({
        data: {
          ...data,
          account_id: accountId
        }
      });

      toast.success('Categoria criada com sucesso!');

      if (onSuccess && response) {
        onSuccess(response as unknown as Category);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Erro ao criar categoria');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <VStack gap={6} align="stretch">
        <FormField
          label="Nome da Categoria"
          error={errors.name?.message}
          placeholder="Ex: Salário, Alimentação"
          {...register('name')}
          bg="var(--card)"
          borderColor="var(--border)"
          borderRadius="full"
          _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
        />

        <FormSelect
          label="Tipo"
          {...register('type')}
          error={errors.type?.message}
          bg="var(--card)"
          borderColor="var(--border)"
          borderRadius="full"
          _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
        >
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </FormSelect>

        <Stack direction="row" gap={3} pt={4} justify="flex-end">
          {onCancel && (
            <Button 
              variant="ghost" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            colorPalette="brand"
            loading={isSubmitting}
          >
            Criar Categoria
          </Button>
        </Stack>
      </VStack>
    </form>
  );
}