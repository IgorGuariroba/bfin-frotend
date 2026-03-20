import {
  Box,
  HStack,
  Field,
  Select,
  Portal,
  createListCollection,
  IconButton,
} from '@chakra-ui/react';
import { Tag, Plus } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { toast } from '../../lib/toast';
import type { Control } from 'react-hook-form';
import type { Category } from '@igorguariroba/bfin-sdk/client';
import type { ExpenseFormData } from '../../hooks/useExpenseFormState';

interface CategorySelectorProps {
  categories?: Category[];
  selectedAccountId: string;
  onNewCategoryClick: () => void;
  control: Control<ExpenseFormData>;
  error?: string;
}

export function CategorySelector({
  categories,
  selectedAccountId,
  onNewCategoryClick,
  control,
  error,
}: CategorySelectorProps) {
  const handleNewCategoryClick = () => {
    if (!selectedAccountId) {
      toast.error('Selecione uma conta primeiro');
      return;
    }
    onNewCategoryClick();
  };

  const collection = createListCollection({
    items: categories?.map((c) => ({ label: c.name, value: c.id ?? '' })) ?? [],
  });

  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
        Categoria
      </Field.Label>
      <HStack gap={2}>
        <Box position="relative" flex={1}>
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1} pointerEvents="none">
            <Tag size={18} color="var(--muted-foreground)" />
          </Box>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select.Root
                collection={collection}
                value={field.value ? [field.value] : []}
                onValueChange={({ value }) => field.onChange(value[0] ?? '')}
                onInteractOutside={() => field.onBlur()}
                positioning={{ sameWidth: true }}
                width="full"
              >
                <Select.HiddenSelect />
                <Select.Control width="full">
                  <Select.Trigger
                    pl={10}
                    width="full"
                    minWidth="230px"
                    borderColor="var(--border)"
                    borderRadius="full"
                    _focus={{
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)',
                    }}
                  >
                    <Select.ValueText placeholder="Selecione uma categoria" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content
                      style={{ backgroundColor: 'var(--card)' }}
                      shadow="lg"
                    >
                      {collection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            )}
          />
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
