import {
  Dialog,
} from '@chakra-ui/react';
import {
  AccountsDialog,
  InvitationsDialog,
  BfinParceiroDialog,
  CreateAccountForm,
} from './index';
import { EmergencyReserveDialog } from './EmergencyReserveDialog';

/**
 * Interface para props dos dialogs do Dashboard
 */
interface DashboardDialogsProps {
  // Estados dos dialogs
  accountDialogOpen: boolean;
  manageAccountsDialogOpen: boolean;
  emergencyReserveDialogOpen: boolean;
  invitationsDialogOpen: boolean;
  bfinParceiroDialogOpen: boolean;

  // Handlers para fechar dialogs
  onCloseAccountDialog: () => void;
  onCloseManageAccountsDialog: () => void;
  onCloseEmergencyReserveDialog: () => void;
  onCloseInvitationsDialog: () => void;
  onCloseBfinParceiroDialog: () => void;
}

/**
 * Componente que gerencia todos os dialogs do Dashboard
 * Responsabilidade única: renderização de dialogs
 * Benefícios Clean Code:
 * - Single Responsibility: apenas gerencia dialogs
 * - Separation of Concerns: separa dialogs da lógica do Dashboard
 * - Reusability: pode ser usado em outros contextos
 * - Maintainability: fácil adicionar/remover dialogs
 */
export function DashboardDialogs({
  accountDialogOpen,
  manageAccountsDialogOpen,
  emergencyReserveDialogOpen,
  invitationsDialogOpen,
  bfinParceiroDialogOpen,
  onCloseAccountDialog,
  onCloseManageAccountsDialog,
  onCloseEmergencyReserveDialog,
  onCloseInvitationsDialog,
  onCloseBfinParceiroDialog,
}: DashboardDialogsProps) {
  return (
    <>
      {/* Dialog para criar conta bancária */}
      <Dialog.Root
        open={accountDialogOpen}
        onOpenChange={(e) => !e.open && onCloseAccountDialog()}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Criar Conta Bancária</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <CreateAccountForm
                onSuccess={onCloseAccountDialog}
                onCancel={onCloseAccountDialog}
              />
            </Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Dialog para gerenciar contas */}
      <AccountsDialog
        isOpen={manageAccountsDialogOpen}
        onClose={onCloseManageAccountsDialog}
      />

      {/* Dialog da reserva de emergência */}
      <EmergencyReserveDialog
        isOpen={emergencyReserveDialogOpen}
        onClose={onCloseEmergencyReserveDialog}
      />

      {/* Dialog de convites */}
      <InvitationsDialog
        isOpen={invitationsDialogOpen}
        onClose={onCloseInvitationsDialog}
      />

      {/* Dialog BFIN Parceiro */}
      <BfinParceiroDialog
        isOpen={bfinParceiroDialogOpen}
        onClose={onCloseBfinParceiroDialog}
      />
    </>
  );
}