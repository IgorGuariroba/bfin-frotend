import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Dialog,
  List,
} from '@chakra-ui/react';
import {
  AccountsDialog,
  InvitationsDialog,
  BfinParceiroDialog,
  CreateAccountForm,
  FooterActions,
  Sidebar,
  SidebarState,
  ExpandedFormType,
} from '../components/organisms';
import {
  ExpandedFormRenderer,
} from '../components/forms';
import { useExpandedForm } from '../hooks/useExpandedForm';
import type { MenuItem } from '../components/organisms/SidebarExpanded';
import { MobileHeaderControls } from '../components/molecules';
import { WidgetManager } from '../components/widgets';
import { useAccounts } from '../hooks/useAccounts';
import { useMyInvitations } from '../hooks/useAccountMembers';
import {
  Shield,
  Wallet,
  Mail,
  CreditCard,
  DollarSign,
  Users,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { iconColors, customShadows } from '../theme';
import { formatCurrency } from '../utils';

interface DashboardProps {
  initialExpandedForm?: ExpandedFormType;
}

export function Dashboard({ initialExpandedForm }: DashboardProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [manageAccountsDialogOpen, setManageAccountsDialogOpen] = useState(false);
  const [emergencyReserveDialogOpen, setEmergencyReserveDialogOpen] = useState(false);
  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);
  const [bfinParceiroDialogOpen, setBfinParceiroDialogOpen] = useState(false);
  const [sidebarState, setSidebarState] = useState<SidebarState>('hidden');

  // Usando o novo hook para gerenciar formulários expandidos
  const { expandedForm, openForm, closeForm, hasOpenForm } = useExpandedForm(initialExpandedForm);
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: _invitations = [] } = useMyInvitations();

  // Cálculos necessários para o dialog de reserva de emergência
  const totals = accounts?.reduce(
    (acc, account) => ({
      emergencyReserve: acc.emergencyReserve + Number(account.emergency_reserve),
    }),
    { emergencyReserve: 0 }
  ) || { emergencyReserve: 0 };


  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  // Callback para receber mudanças de estado da sidebar
  const handleSidebarStateChange = (newState: SidebarState) => {
    setSidebarState(newState);
  };

  // Ref para controlar a sidebar externamente
  const sidebarToggleRef = useRef<(() => void) | null>(null);

  // Função para toggle da sidebar (usada pelo MobileHeaderControls)
  const handleToggleSidebar = () => {
    if (sidebarToggleRef.current) {
      sidebarToggleRef.current();
    }
  };

  // Sidebar menu items configuration
  const sidebarMenuItems: MenuItem[] = [
    {
      id: 'calendar',
      icon: CalendarIcon,
      label: 'Calendário',
      onClick: () => openForm('calendario'),
    },
    {
      id: 'help',
      icon: Shield,
      label: 'Me ajuda',
      onClick: () => {
        // TODO: Implement help functionality
      },
    },
    {
      id: 'profile',
      icon: Users,
      label: 'Perfil',
      onClick: () => {
        // TODO: Implement profile functionality
      },
    },
    {
      id: 'configure-account',
      icon: DollarSign,
      label: 'Configurar conta',
      onClick: () => setManageAccountsDialogOpen(true),
    },
    {
      id: 'configure-card',
      icon: CreditCard,
      label: 'Configurar cartão',
      onClick: () => {
        // TODO: Implement card configuration
      },
    },
    {
      id: 'business-account',
      icon: Wallet,
      label: 'Pedir conta PJ',
      onClick: () => {
        // TODO: Implement business account request
      },
    },
    {
      id: 'notifications',
      icon: Mail,
      label: 'Configurar notificações',
      onClick: () => {
        // TODO: Implement notifications configuration
      },
    },
  ];



  return (
    <Flex minH="100vh" bg="var(--primary)" direction="column">
      {/* Header */}
      <Flex
        as="header"
        bg="var(--primary)"
        px={{ base: 4, md: 6 }}
        py={3}
        align="center"
        justify="space-between"
        boxShadow={customShadows.whiteGlow.sm}
      >
        <Flex align="center" gap={3} minW={0}>
          {/* Controles móveis - aparecem apenas no mobile */}
          <MobileHeaderControls
            sidebarState={sidebarState}
            onToggleSidebar={handleToggleSidebar}
            onHomeClick={closeForm}
            showHomeButton={true}
          />

          <VStack align="flex-start" gap={0} minW={0}>
            <Text
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="extrabold"
              color="var(--primary-foreground)"
              fontFamily="'Playfair Display SC', serif"
              lineHeight="shorter"
            >
              BFIN
            </Text>
            <Text
              color="var(--primary-foreground)"
              fontSize="xs"
              display={{ base: 'block', md: 'none' }}
              lineClamp={1}
            >
              Olá, {user?.full_name?.split(' ')[0]}
            </Text>
          </VStack>
          <Text color="var(--primary-foreground)" fontSize="sm" display={{ base: 'none', md: 'block' }}>
            - Olá, {user?.full_name?.split(' ')[0]}
          </Text>
        </Flex>

        <HStack gap={{ base: 1, md: 2 }}>
          <ThemeToggle variant="icon" size="md" />
          <IconButton
            aria-label="Fechar"
            size="sm"
            variant="ghost"
            color="var(--primary-foreground)"
            _hover={{ bg: 'whiteAlpha.100' }}
            onClick={handleSignOut}
            border="none"
            _focus={{ boxShadow: 'none' }}
          >
            <X size={16} />
          </IconButton>
        </HStack>
      </Flex>

      {/* Main Layout - Sidebar + Content */}
      <Flex flex="1" overflow="hidden" position="relative">
        {/* Sidebar */}
        <Sidebar
          menuItems={sidebarMenuItems}
          onHomeClick={closeForm}
          onSignOut={handleSignOut}
          onVisibilityClick={() => {
            // TODO: Implement visibility toggle
          }}
          onToggleSidebar={handleSidebarStateChange}
          toggleRef={sidebarToggleRef}
          hiddenOnMobile={true}
          defaultMobileState="hidden"
          defaultDesktopState="collapsed"
        />

        {/* Content Area */}
        <Flex flex="1" direction="column" overflow="auto" position="relative">
          {/* Renderizador de formulários expandidos - Clean Code refactored */}
          <ExpandedFormRenderer
            expandedForm={expandedForm}
            onClose={closeForm}
            extraProps={{
              invitationsCount: _invitations.length,
              onOpenInvitations: () => setInvitationsDialogOpen(true),
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
          />
        </Flex>
      </Flex>

      {/* Dialogs */}
      <Dialog.Root open={accountDialogOpen} onOpenChange={(e) => setAccountDialogOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Criar Conta Bancária</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <CreateAccountForm
                onSuccess={() => setAccountDialogOpen(false)}
                onCancel={() => setAccountDialogOpen(false)}
              />
            </Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <AccountsDialog
        isOpen={manageAccountsDialogOpen}
        onClose={() => setManageAccountsDialogOpen(false)}
      />

      <Dialog.Root open={emergencyReserveDialogOpen} onOpenChange={(e) => setEmergencyReserveDialogOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <HStack>
                <Shield size={20} color={iconColors.info} />
                <Text>Reserva de Emergência</Text>
              </HStack>
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={4} align="stretch">
                <Box
                  bg={{ base: 'blue.100', _dark: 'blue.900/30' }}
                  borderWidth="1px"
                  borderColor={{ base: 'blue.200', _dark: 'blue.700/50' }}
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="sm" color={{ base: 'blue.700', _dark: 'blue.300' }} mb={2}>
                    Sua reserva de emergência é calculada automaticamente como 30% de todas as receitas recebidas.
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color={{ base: 'blue.600', _dark: 'blue.400' }}>
                    {loadingAccounts ? 'Carregando...' : formatCurrency(totals.emergencyReserve)}
                  </Text>
                </Box>

                <VStack gap={2} align="stretch" fontSize="sm" color={{ base: 'muted.fg', _dark: 'muted.fg' }}>
                  <Heading size="sm" color={{ base: 'fg', _dark: 'fg' }}>Para que serve?</Heading>
                  <List.Root pl={6} listStyleType="disc">
                    <List.Item>Proteção financeira para imprevistos</List.Item>
                    <List.Item>Cobertura para emergências médicas</List.Item>
                    <List.Item>Segurança em caso de perda de renda</List.Item>
                    <List.Item>Reparos urgentes em casa ou veículo</List.Item>
                  </List.Root>
                </VStack>

                <Box
                  bg={{ base: 'muted', _dark: 'muted' }}
                  borderRadius="lg"
                  p={4}
                  fontSize="xs"
                  color={{ base: 'muted.fg', _dark: 'muted.fg' }}
                >
                  <Text fontWeight="medium" color={{ base: 'fg', _dark: 'fg' }} mb={1}>Como funciona:</Text>
                  <Text>
                    A cada receita recebida, 30% é automaticamente separado para sua reserva de emergência.
                    Os 70% restantes ficam disponíveis para seus gastos do dia a dia.
                  </Text>
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <InvitationsDialog
        isOpen={invitationsDialogOpen}
        onClose={() => setInvitationsDialogOpen(false)}
      />

      <BfinParceiroDialog
        isOpen={bfinParceiroDialogOpen}
        onClose={() => setBfinParceiroDialogOpen(false)}
      />
    </Flex>
  );
}
