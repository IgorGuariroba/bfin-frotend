import {
  Box,
  Field,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, FieldPath } from 'react-hook-form';
import type { LucideIcon } from 'lucide-react';

interface SelectFieldItem {
  label: string;
  value: string;
}

interface SelectFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  items: SelectFieldItem[];
  error?: string;
}

export function SelectField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = 'Selecione uma opção',
  icon: Icon,
  items,
  error,
}: SelectFieldProps<T>) {
  const collection = createListCollection({ items });

  return (
    <Field.Root invalid={!!error} width="full" flex={1} minWidth={0}>
      <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
        {label}
      </Field.Label>
      <Box position="relative" width="full">
        {Icon && (
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1} pointerEvents="none">
            <Icon size={18} color="var(--muted-foreground)" />
          </Box>
        )}
        <Controller
          control={control}
          name={name}
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
                  pl={Icon ? 10 : 4}
                  width="full"
                  borderColor="var(--border)"
                  borderRadius="full"
                  _focus={{
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 1px var(--primary)',
                  }}
                >
                  <Select.ValueText
                    placeholder={placeholder}
                    flex={1}
                    minWidth={0}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  />
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
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}
