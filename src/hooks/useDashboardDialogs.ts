import { useState } from 'react';

/**
 * Hook para gerenciar estados de todos os dialogs do Dashboard
 * Responsabilidade única: gerenciamento de estado de dialogs
 * Benefícios: reduz complexidade do Dashboard, facilita testes
 */
export function useDashboardDialogs() {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [manageAccountsDialogOpen, setManageAccountsDialogOpen] = useState(false);
  const [emergencyReserveDialogOpen, setEmergencyReserveDialogOpen] = useState(false);
  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);
  const [bfinParceiroDialogOpen, setBfinParceiroDialogOpen] = useState(false);

  // Funções com nomes claros e específicos
  const openAccountDialog = () => setAccountDialogOpen(true);
  const closeAccountDialog = () => setAccountDialogOpen(false);

  const openManageAccountsDialog = () => setManageAccountsDialogOpen(true);
  const closeManageAccountsDialog = () => setManageAccountsDialogOpen(false);

  const openEmergencyReserveDialog = () => setEmergencyReserveDialogOpen(true);
  const closeEmergencyReserveDialog = () => setEmergencyReserveDialogOpen(false);

  const openInvitationsDialog = () => setInvitationsDialogOpen(true);
  const closeInvitationsDialog = () => setInvitationsDialogOpen(false);

  const openBfinParceiroDialog = () => setBfinParceiroDialogOpen(true);
  const closeBfinParceiroDialog = () => setBfinParceiroDialogOpen(false);

  // Função utilitária para fechar todos os dialogs
  const closeAllDialogs = () => {
    setAccountDialogOpen(false);
    setManageAccountsDialogOpen(false);
    setEmergencyReserveDialogOpen(false);
    setInvitationsDialogOpen(false);
    setBfinParceiroDialogOpen(false);
  };

  return {
    // Estados
    accountDialogOpen,
    manageAccountsDialogOpen,
    emergencyReserveDialogOpen,
    invitationsDialogOpen,
    bfinParceiroDialogOpen,

    // Actions
    openAccountDialog,
    closeAccountDialog,
    openManageAccountsDialog,
    closeManageAccountsDialog,
    openEmergencyReserveDialog,
    closeEmergencyReserveDialog,
    openInvitationsDialog,
    closeInvitationsDialog,
    openBfinParceiroDialog,
    closeBfinParceiroDialog,
    closeAllDialogs,
  };
}