import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack } from '@chakra-ui/react';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

const schema = z.object({
  field: z.string().min(1, 'Campo obrigatório'),
});

type FormData = z.infer<typeof schema>;

export interface OrganismTemplateProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * OrganismTemplate - Complex component with business logic and state
 */
export function OrganismTemplate({ onSuccess, onCancel }: OrganismTemplateProps) {
  // 1. Hooks for data (React Query)
  // const { data, isLoading } = useCustomHook();

  // 2. Form management
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    // Logic to handle form submission
    // await mutation.mutateAsync(data);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={6}>
        <FormField 
          label="Campo" 
          error={errors.field?.message} 
          {...register('field')} 
        />
        
        <Stack direction="row" justify="flex-end" gap={3}>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" loading={isSubmitting}>
            Salvar
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
