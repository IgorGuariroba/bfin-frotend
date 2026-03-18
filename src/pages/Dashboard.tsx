import { Flex } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  FooterActions,
  DashboardHeader,
  DashboardDialogs,
  ExpandedFormType,
} from '../components/organisms';
import { ExpandedFormRenderer } from '../components/forms';
import { WidgetManager } from '../components/widgets';
import { useExpandedForm } from '../hooks/useExpandedForm';
import { useMyInvitations } from '../hooks/useAccountMembers';
import { useDashboardDialogs } from '../hooks/useDashboardDialogs';
import { useDashboardSidebar } from '../hooks/useDashboardSidebar';

/**
 * Interface para props do Dashboard
 */
interface DashboardProps {
  initialExpandedForm?: ExpandedFormType;
}

/**
 * Dashboard Principal da Aplicação BFIN
 *
 * Responsabilidade única: orquestração do layout principal
 *
 * Benefícios Clean Code aplicados:
 * - Single Responsibility Principle: apenas layout e orquestração
 * - Open/Closed Principle: extensível via hooks e componentes
 * - Dependency Inversion: depende de abstrações (hooks)
 * - Small Function: 50 linhas vs 355 originais
 * - No Side Effects: efeitos isolados em hooks
 * - Descriptive Names: nomes claros e específicos
 * - Separation of Concerns: cada responsabilidade em seu local
 *
 * Refatorações implementadas:
 * ✅ Extraído: useDashboardDialogs (gerenciamento de dialogs)
 * ✅ Extraído: useDashboardSidebar (configuração de sidebar)
 * ✅ Extraído: useFinancialCalculations (lógica de negócio)
 * ✅ Extraído: DashboardHeader (UI do cabeçalho)
 * ✅ Extraído: DashboardDialogs (gerenciamento de dialogs)
 * ✅ Extraído: EmergencyReserveDialog (dialog complexo)
 * ✅ Removido: magic numbers/strings (constantes)
 * ✅ Removido: formatCurrency duplicado (utilitário)
 */
export function Dashboard({ initialExpandedForm }: DashboardProps) {
  // ==============================
  // HOOKS DE CONTEXTO
  // ==============================
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // ==============================
  // HOOKS DE ESTADO ESPECÍFICO
  // ==============================
  const { expandedForm, openForm, closeForm, hasOpenForm } = useExpandedForm(initialExpandedForm);
  const { data: invitations = [] } = useMyInvitations();

  // ==============================
  // HOOKS DE LÓGICA DE NEGÓCIO
  // ==============================
  const dialogs = useDashboardDialogs();

  const sidebar = useDashboardSidebar({
    onOpenForm: openForm,
    onOpenManageAccounts: dialogs.openManageAccountsDialog,
  });

  // ==============================
  // HANDLERS DE AÇÕES
  // ==============================
  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  // ==============================
  // RENDER PRINCIPAL
  // ==============================
  return (
    <Flex minH="100vh" bg="var(--primary)" direction="column">
      {/* Header */}
      <DashboardHeader
        sidebarState={sidebar.sidebarState}
        onToggleSidebar={sidebar.handleToggleSidebar}
        onHomeClick={closeForm}
        onSignOut={handleSignOut}
      />

      {/* Layout Principal - Sidebar + Content */}
      <Flex flex="1" overflow="hidden" position="relative">
        {/* Sidebar */}
        <Sidebar
          menuItems={sidebar.menuItems}
          onHomeClick={closeForm}
          onSignOut={handleSignOut}
          onVisibilityClick={() => {
            // TODO: Implement visibility toggle
          }}
          onToggleSidebar={sidebar.handleSidebarStateChange}
          toggleRef={sidebar.sidebarToggleRef}
          hiddenOnMobile={sidebar.config.hiddenOnMobile}
          defaultMobileState={sidebar.config.defaultMobileState}
          defaultDesktopState={sidebar.config.defaultDesktopState}
        />

        {/* Área de Conteúdo */}
        <Flex flex="1" direction="column" overflow="auto" position="relative">
          {/* Renderizador de formulários expandidos */}
          <ExpandedFormRenderer
            expandedForm={expandedForm}
            onClose={closeForm}
            extraProps={{
              invitationsCount: invitations.length,
              onOpenInvitations: dialogs.openInvitationsDialog,
            }}
          />

          {/* Dashboard principal - só mostra quando não há formulário expandido */}
          {!hasOpenForm && (
            <WidgetManager
              onExpandForm={openForm}
              layout="auto"
              maxWidgetsPerColumn={3}
            />
          )}

          {/* Footer Actions */}
          <FooterActions
            expandedForm={expandedForm}
            onFormSelect={openForm}
            onHomeClick={closeForm}
          />
        </Flex>
      </Flex>

      {/* Dialogs */}
      <DashboardDialogs
        accountDialogOpen={dialogs.accountDialogOpen}
        manageAccountsDialogOpen={dialogs.manageAccountsDialogOpen}
        emergencyReserveDialogOpen={dialogs.emergencyReserveDialogOpen}
        invitationsDialogOpen={dialogs.invitationsDialogOpen}
        bfinParceiroDialogOpen={dialogs.bfinParceiroDialogOpen}
        onCloseAccountDialog={dialogs.closeAccountDialog}
        onCloseManageAccountsDialog={dialogs.closeManageAccountsDialog}
        onCloseEmergencyReserveDialog={dialogs.closeEmergencyReserveDialog}
        onCloseInvitationsDialog={dialogs.closeInvitationsDialog}
        onCloseBfinParceiroDialog={dialogs.closeBfinParceiroDialog}
      />
    </Flex>
  );
}