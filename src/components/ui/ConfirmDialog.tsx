import { Dialog, Button, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  colorPalette?: string;
}

let confirmDialogState: {
  resolve: (value: boolean) => void;
  options: ConfirmDialogOptions;
} | null = null;

let setDialogOpen: ((open: boolean) => void) | null = null;
let setDialogOptions: ((options: ConfirmDialogOptions) => void) | null = null;

export function ConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    title: '',
    description: '',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    colorPalette: 'blue',
  });

  useEffect(() => {
    setDialogOpen = setOpen;
    setDialogOptions = setOptions;
    return () => {
      setDialogOpen = null;
      setDialogOptions = null;
    };
  }, []);

  const handleConfirm = () => {
    if (confirmDialogState) {
      confirmDialogState.resolve(true);
      confirmDialogState = null;
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (confirmDialogState) {
      confirmDialogState.resolve(false);
      confirmDialogState = null;
    }
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleCancel()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{options.title}</Dialog.Title>
          </Dialog.Header>
          {options.description && (
            <Dialog.Body>
              <Text>{options.description}</Text>
            </Dialog.Body>
          )}
          <Dialog.Footer gap={2}>
            <Button variant="outline" onClick={handleCancel}>
              {options.cancelLabel}
            </Button>
            <Button colorPalette={options.colorPalette} onClick={handleConfirm}>
              {options.confirmLabel}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function confirm(options: ConfirmDialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    confirmDialogState = { resolve, options };
    if (setDialogOpen && setDialogOptions) {
      setDialogOptions(options);
      setDialogOpen(true);
    }
  });
}
