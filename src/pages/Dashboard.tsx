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
  Grid,
} from '@chakra-ui/react';
import { Button } from '../components/atoms/Button';
import {
  AccountsDialog,
  InvitationsDialog,
  BfinParceiroDialog,
  VariableExpenseForm,
  IncomeForm,
  FixedExpenseForm,
  BfinParceiroForm,
  Extrato,
  CreateAccountForm,
  DailyLimitForm,
  FooterActions,
  Sidebar,
  SidebarState
} from '../components/organisms';
import type { MenuItem } from '../components/organisms/SidebarExpanded';
import { MobileHeaderControls } from '../components/molecules';
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
  ArrowLeft
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { iconColors, customShadows } from '../theme';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [manageAccountsDialogOpen, setManageAccountsDialogOpen] = useState(false);
  const [emergencyReserveDialogOpen, setEmergencyReserveDialogOpen] = useState(false);
  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);
  const [bfinParceiroDialogOpen, setBfinParceiroDialogOpen] = useState(false);
  const [expandedForm, setExpandedForm] = useState<'pagar' | 'bfin-parceiro' | 'transferir' | 'depositar' | 'emprestimos' | 'agendar-pagamento' | 'recarga-celular' | 'ajustar-limite' | 'extrato' | null>(null);
  const [sidebarState, setSidebarState] = useState<SidebarState>('hidden');
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: _invitations = [] } = useMyInvitations();

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

  const renderExpandedContent = () => {
    if (!expandedForm) return null;

    const getTitle = () => {
      switch (expandedForm) {
        case 'pagar': return 'Nova Despesa';
        case 'bfin-parceiro': return 'Convidar Bfin Parceiro';
        case 'transferir': return 'Transferir';
        case 'depositar': return 'Depositar';
        case 'emprestimos': return 'Empréstimos';
        case 'agendar-pagamento': return 'Agendar Pagamento';
        case 'recarga-celular': return 'Recarga de Celular';
        case 'ajustar-limite': return 'Ajustar Limite';
        case 'extrato': return 'Extrato da Conta';
        default: return '';
      }
    };

    const getContent = () => {
      switch (expandedForm) {
        case 'extrato':
          return <Extrato />;
        case 'pagar':
          return (
            <VariableExpenseForm
              onSuccess={() => setExpandedForm(null)}
              onCancel={() => setExpandedForm(null)}
            />
          );
        case 'depositar':
          return (
            <IncomeForm
              onSuccess={() => setExpandedForm(null)}
              onCancel={() => setExpandedForm(null)}
            />
          );
        case 'agendar-pagamento':
          return (
            <FixedExpenseForm
              onSuccess={() => setExpandedForm(null)}
              onCancel={() => setExpandedForm(null)}
            />
          );
        case 'bfin-parceiro':
          return (
            <BfinParceiroForm
              onSuccess={() => setExpandedForm(null)}
              onCancel={() => setExpandedForm(null)}
            />
          );
        case 'transferir':
          return (
            <Box>
              <Text color="var(--muted-foreground)">
                Funcionalidade de transferência em desenvolvimento.
              </Text>
            </Box>
          );
        case 'emprestimos':
          return (
            <Box>
              <Text color="var(--muted-foreground)">
                Funcionalidade de empréstimos em desenvolvimento.
              </Text>
            </Box>
          );
        case 'recarga-celular':
          return (
            <Box>
              <Text color="var(--muted-foreground)">
                Funcionalidade de recarga de celular em desenvolvimento.
              </Text>
            </Box>
          );
        case 'ajustar-limite':
          return (
            <DailyLimitForm
              onSuccess={() => setExpandedForm(null)}
              onCancel={() => setExpandedForm(null)}
            />
          );
        default:
          return null;
      }
    };

    const hasGreenHeader = expandedForm === 'pagar' || expandedForm === 'depositar' || expandedForm === 'bfin-parceiro' || expandedForm === 'agendar-pagamento' || expandedForm === 'ajustar-limite' || expandedForm === 'extrato';

    return (
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={hasGreenHeader ? 'var(--primary)' : 'var(--background)'}
        zIndex={10}
        overflow="auto"
        css={{
          animation: 'dropExpand 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          '@keyframes dropExpand': {
            '0%': {
              borderRadius: '50%',
              width: 'calc((100% - 112px) / 7)',
              height: '80px',
              bottom: '90px',
              left: '32px',
              top: 'auto',
              transform: 'scale(0.3)',
              opacity: 0.5,
            },
            '50%': {
              borderRadius: '24px',
              opacity: 0.8,
            },
            '100%': {
              borderRadius: '0',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              bottom: 0,
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }}
      >
        {expandedForm === 'extrato' ? (
          <Extrato onBack={() => setExpandedForm(null)} />
        ) : hasGreenHeader ? (
          <VStack gap={0} align="stretch" minH="100vh">
            {/* Green Header */}
            <Box bg="var(--primary)" px={6} py={6} pb={8}>
              <Flex align="center" gap={4} mb={6}>
                <IconButton
                  aria-label="Voltar"
                  variant="ghost"
                  onClick={() => setExpandedForm(null)}
                  size="sm"
                  color="var(--primary-foreground)"
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  <ArrowLeft size={20} />
                </IconButton>
                <Heading size="lg" color="var(--primary-foreground)" flex="1">
                  {getTitle()}
                </Heading>
              </Flex>
              {getContent()}
            </Box>
          </VStack>
        ) : (
          <Box p={8} maxW="2xl" mx="auto" pb="140px">
            <Flex align="center" gap={4} mb={6}>
              <IconButton
                aria-label="Fechar"
                variant="ghost"
                onClick={() => setExpandedForm(null)}
                size="sm"
                color="var(--card-foreground)"
              >
                <X size={20} />
              </IconButton>
              <Heading size="lg" color="var(--card-foreground)">{getTitle()}</Heading>
            </Flex>
            <Box
              bg="var(--card)"
              borderRadius="xl"
              p={6}
              shadow="md"
            >
              {getContent()}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const totals = accounts?.reduce(
    (acc, account) => ({
      totalBalance: acc.totalBalance + Number(account.total_balance),
      availableBalance: acc.availableBalance + Number(account.available_balance),
      lockedBalance: acc.lockedBalance + Number(account.locked_balance),
      emergencyReserve: acc.emergencyReserve + Number(account.emergency_reserve),
    }),
    { totalBalance: 0, availableBalance: 0, lockedBalance: 0, emergencyReserve: 0 }
  ) || { totalBalance: 0, availableBalance: 0, lockedBalance: 0, emergencyReserve: 0 };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Flex minH="100vh" bg="var(--primary)" direction="column">
      {/* Header */}
      <Flex
        as="header"
        bg="var(--primary)"
        px={6}
        py={3}
        align="center"
        justify="space-between"
        boxShadow={customShadows.whiteGlow.sm}
      >
        <HStack gap={4}>
          {/* Controles móveis - aparecem apenas no mobile */}
          <MobileHeaderControls
            sidebarState={sidebarState}
            onToggleSidebar={handleToggleSidebar}
            onHomeClick={() => setExpandedForm(null)}
            showHomeButton={true}
          />

          <Text
            fontSize="3xl"
            fontWeight="extrabold"
            color="var(--primary-foreground)"
            fontFamily="'Playfair Display SC', serif"
          >
            BFIN
          </Text>
          <Text color="var(--primary-foreground)" fontSize="sm">
            - Olá, {user?.full_name?.split(' ')[0]}
          </Text>
        </HStack>

        <HStack gap={2}>
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
          onHomeClick={() => setExpandedForm(null)}
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
          {renderExpandedContent()}
          {!expandedForm && (
            <Grid
              templateColumns={{ base: '1fr', lg: '440px 1fr' }}
              gap={6}
              p={8}
              pb="140px"
              flex="1"
            >
            {/* Left Column - Cards */}
            <VStack gap={4} align="stretch">
              {/* Card Bfinconta */}
              <Box
                bg="var(--card)"
                borderRadius="xl"
                p={6}
                shadow="md"
              >
                <HStack mb={4}>
                  <DollarSign size={20} color="var(--muted-foreground)" />
                  <Text color="var(--muted-foreground)" fontWeight="medium">
                    Bfinconta
                  </Text>
                </HStack>

                <Box mb={4}>
                  <Text fontSize="xs" color="var(--muted-foreground)" mb={1}>
                    Saldo disponível
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="var(--muted-foreground)">
                    {loadingAccounts ? 'Carregando...' : formatCurrency(totals.availableBalance)}
                  </Text>
                  <Text fontSize="sm" color="var(--muted-foreground)" mt={1}>
                    Valor investido: <Text as="span" color="var(--muted-foreground)" fontWeight="medium">{formatCurrency(totals.emergencyReserve)}</Text>
                  </Text>
                </Box>

                <Button
                  size="md"
                  bg="var(--primary)"
                  color="var(--primary-foreground)"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => setExpandedForm('extrato')}
                >
                  ACESSAR
                </Button>
              </Box>

            </VStack>

            {/* Right Column - Info & Charts */}
            <VStack gap={6} align="stretch">

            </VStack>
          </Grid>
          )}

          {/* Footer Actions */}
          <FooterActions
            expandedForm={expandedForm}
            onFormSelect={setExpandedForm}
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
