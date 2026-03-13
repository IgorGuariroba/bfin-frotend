import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, HStack, VStack, Box, Input, NativeSelect, Field } from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { toast } from '../../../lib/toast';

// 1. Defina o esquema de validação com Zod
const formSchema = z.object({
  // Exemplo: name: z.string().min(1, 'Nome é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<FormData>;
}

export function CustomForm({ onSuccess, onCancel, initialData }: FormProps) {
  // 2. Hooks de Dados (React Query)
  // Exemplo: const { data } = useData();
  // Exemplo: const mutation = useCreateMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      // Exemplo: name: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // 3. Mutação
      // await mutation.mutateAsync(data);
      toast.success('Sucesso!');
      onSuccess?.();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={6} align="stretch">
        {/* 4. Campos do Formulário (Chakra UI v3) */}
        <Field.Root invalid={!!errors.name}>
          <Field.Label>Campo Exemplo</Field.Label>
          <Input {...register('name')} placeholder="Digite aqui..." />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <HStack gap={4} justify="flex-end">
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Salvar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
