import { Dialog } from '@chakra-ui/react';
import { CategoryForm } from '../forms/CategoryForm';
import type { Category } from '@igorguariroba/bfin-sdk/client';

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  onCategoryCreated: (category: Category) => void;
  defaultType?: 'income' | 'expense';
  accountId: string;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCategoryCreated,
  defaultType,
  accountId,
}: CreateCategoryDialogProps) {
  const handleSuccess = (category: Category) => {
    onCategoryCreated(category);
    onOpenChange({ open: false });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="var(--card)" borderRadius="2xl">
          <Dialog.Header>
            <Dialog.Title>Nova Categoria</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            <CategoryForm
              onSuccess={handleSuccess}
              onCancel={() => onOpenChange({ open: false })}
              defaultType={defaultType}
              accountId={accountId}
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
