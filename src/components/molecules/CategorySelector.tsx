import {
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { Tag, Plus } from 'lucide-react';
import { toast } from '../../lib/toast';
import type { Control, FieldValues, FieldPath } from 'react-hook-form';
import type { Category } from '@igorguariroba/bfin-sdk/client';
import { SelectField } from './SelectField';

interface CategorySelectorProps<T extends FieldValues = FieldValues> {
  categories?: Category[];
  selectedAccountId: string;
  onNewCategoryClick: () => void;
  control: Control<T>;
  name?: FieldPath<T>;
  error?: string;
}

export function CategorySelector<T extends FieldValues = FieldValues>({
  categories,
  selectedAccountId,
  onNewCategoryClick,
  control,
  name = 'categoryId' as FieldPath<T>,
  error,
}: CategorySelectorProps<T>) {
  const handleNewCategoryClick = () => {
    if (!selectedAccountId) {
      toast.error('Selecione uma conta primeiro');
      return;
    }
    onNewCategoryClick();
  };

  const items = categories?.map((c) => ({ label: c.name ?? '', value: c.id ?? '' })) ?? [];

  return (
    <HStack gap={2} align="end">
      <SelectField
        control={control}
        name={name}
        label="Categoria"
        placeholder="Selecione uma categoria"
        icon={Tag}
        items={items}
        error={error}
      />
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
  );
}
