import {
  Box,
  HStack,
  Field,
  NativeSelect,
  IconButton,
} from '@chakra-ui/react';
import { Tag, Plus } from 'lucide-react';
import { toast } from '../../lib/toast';
import type { UseFormRegister } from 'react-hook-form';
import type { Category } from '@igorguariroba/bfin-sdk/client';
import type { ExpenseFormData } from '../../hooks/useExpenseFormState';

interface CategorySelectorProps {
  categories?: Category[];
  selectedAccountId: string;
  onNewCategoryClick: () => void;
  register: UseFormRegister<ExpenseFormData>;
  error?: string;
}

export function CategorySelector({
  categories,
  selectedAccountId,
  onNewCategoryClick,
  register,
  error,
}: CategorySelectorProps) {
  const handleNewCategoryClick = () => {
    if (!selectedAccountId) {
      toast.error('Selecione uma conta primeiro');
      return;
    }
    onNewCategoryClick();
  };

  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
        Categoria
      </Field.Label>
      <HStack gap={2}>
        <Box position="relative" flex={1}>
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
            <Tag size={18} color="var(--muted-foreground)" />
          </Box>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register('categoryId')}
              placeholder="Selecione uma categoria"
              pl={10}
              borderColor="var(--border)"
              borderRadius="full"
              _focus={{
                borderColor: 'var(--primary)',
                boxShadow: '0 0 0 1px var(--primary)',
              }}
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
        <IconButton
          aria-label="Nova Categoria"
          onClick={handleNewCategoryClick}
          variant="outline"
          borderRadius="full"
          borderColor="var(--border)"
          disabled={!selectedAccountId}
        >
          <Plus size={18} />
        </IconButton>
      </HStack>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}