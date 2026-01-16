import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  IconButton,
  Dialog,
  List,
  Tooltip,
  Icon,
  Grid,
  Separator,
} from '@chakra-ui/react';
import { Button } from '../components/atoms/Button';
import { CreateAccountForm } from '../components/organisms/forms';
import { AccountsDialog, InvitationsDialog, BfinParceiroDialog } from '../components/organisms/dialogs';
import { VariableExpenseForm, IncomeForm, FixedExpenseForm, BfinParceiroForm } from '../components/organisms/forms';
import { useAccounts } from '../hooks/useAccounts';
import { useMyInvitations } from '../hooks/useAccountMembers';
import {
  Shield,
  Calendar,
  Wallet,
  Mail,
  Home,
  Settings,
  Eye,
  CreditCard,
  DollarSign,
  Users,
  Send,
  Download,
  Smartphone,
  Sliders,
  BarChart3,
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [expandedForm, setExpandedForm] = useState<'pagar' | 'bfin-parceiro' | 'transferir' | 'depositar' | 'emprestimos' | 'agendar-pagamento' | 'recarga-celular' | 'ajustar-limite' | null>(null);
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: _invitations = [] } = useMyInvitations();

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

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
        default: return '';
      }
    };

    const getContent = () => {
      switch (expandedForm) {
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
            <Box>
              <Text color="var(--muted-foreground)">
                Funcionalidade de ajuste de limite em desenvolvimento.
              </Text>
            </Box>
          );
        default:
          return null;
      }
    };

    const hasGreenHeader = expandedForm === 'pagar' || expandedForm === 'depositar' || expandedForm === 'bfin-parceiro';

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
        {hasGreenHeader ? (
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
        {/* Sidebar Collapsed */}
        <VStack
          w="80px"
          bg="var(--primary)"
          py={6}
          gap={6}
          boxShadow={customShadows.whiteGlow.side}
          position="relative"
          zIndex={1}
        >
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton
                aria-label="Home"
                variant="ghost"
                color="var(--primary-foreground)"
                _hover={{ bg: 'whiteAlpha.100' }}
                size="lg"
                border="none"
                _focus={{ boxShadow: 'none' }}
                onClick={() => setExpandedForm(null)}
              >
                <Home size={24} />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>Home</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton
                aria-label="Configurações"
                variant="ghost"
                color="var(--primary-foreground)"
                _hover={{ bg: 'whiteAlpha.100' }}
                size="lg"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                border="none"
                _focus={{ boxShadow: 'none' }}
              >
                <Settings size={24} />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>Ocultar configurações</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton
                aria-label="Visibilidade"
                variant="ghost"
                color="var(--primary-foreground)"
                _hover={{ bg: 'whiteAlpha.100' }}
                size="lg"
                border="none"
                _focus={{ boxShadow: 'none' }}
              >
                <Eye size={24} />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>Visibilidade</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </VStack>

        {/* Sidebar Expanded */}
        {sidebarExpanded && (
          <Box
            position="absolute"
            left="80px"
            top="0"
            bottom="0"
            w="320px"
            bg="var(--primary)"
            zIndex={20}
            boxShadow="2xl"
            overflowY="auto"
          >
            <VStack p={6} gap={6} align="stretch">
              {/* QR Code and Account Info */}
              <VStack gap={4} align="stretch">
                <Flex justify="center">
                  <Box
                    w="180px"
                    h="180px"
                    bg="card"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xs" color="muted.fg">QR Code</Text>
                  </Box>
                </Flex>

                <VStack align="flex-start" gap={0} fontSize="xs" color="var(--primary-foreground)" opacity={0.8}>
                  <Text>Agência: 0001</Text>
                  <Text>Conta: 1000001-0</Text>
                  <Text>Banco: 260 - BFIN Pagamentos S.A.</Text>
                </VStack>
              </VStack>

              <Separator borderColor="whiteAlpha.200" />

              {/* Menu Options */}
              <VStack gap={2} align="stretch">
                <Button
                  variant="ghost"
                  color="var(--primary-foreground)"
                  justifyContent="space-between"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  size="lg"
                >
                  <HStack>
                    <Icon as={Shield} boxSize={5} />
                    <Text>Me ajuda</Text>
                  </HStack>
                  <Text>›</Text>
                </Button>

                <Button
                  variant="ghost"
                  color="var(--primary-foreground)"
                  justifyContent="space-between"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  size="lg"
                >
                  <HStack>
                    <Icon as={Users} boxSize={5} />
                    <Text>Perfil</Text>
                  </HStack>
                  <Text>›</Text>
                </Button>

                <Button
                  variant="ghost"
                  color="var(--primary-foreground)"
                  justifyContent="space-between"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  size="lg"
                  onClick={() => setManageAccountsDialogOpen(true)}
                >
                  <HStack>
                    <Icon as={DollarSign} boxSize={5} />
                    <Text>Configurar conta</Text>
                  </HStack>
                  <Text>›</Text>
                </Button>

                <Button
                  variant="ghost"
                  color="var(--primary-foreground)"
                  justifyContent="space-between"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  size="lg"
                >
                  <HStack>
                    <Icon as={CreditCard} boxSize={5} />
                    <Text>Configurar cartão</Text>
                  </HStack>
                  <Text>›</Text>
                </Button>

                <Button
                  variant="ghost"
                  color="var(--primary-foreground)"
                  justifyContent="space-between"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  size="lg"
                >
                  <HStack>
                    <Icon as={Wallet} boxSize={5} />
                    <Text>Pedir conta PJ</Text>
                  </HStack>
                  <Text>›</Text>
                </Button>

                <Button
                  variant="ghost"
                  color="var(--primary-foreground)"
                  justifyContent="space-between"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  size="lg"
                >
                  <HStack>
                    <Icon as={Mail} boxSize={5} />
                    <Text>Configurar notificações</Text>
                  </HStack>
                  <Text>›</Text>
                </Button>
              </VStack>

              <Box flex="1" />

              <Button
                variant="solid"
                bg="transparent"
                color="var(--primary-foreground)"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.100' }}
                size="lg"
                onClick={handleSignOut}
              >
                DESCONECTAR
              </Button>
            </VStack>
          </Box>
        )}

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
                  onClick={() => setManageAccountsDialogOpen(true)}
                >
                  ACESSAR
                </Button>
              </Box>

            </VStack>

            {/* Right Column - Info & Charts */}
            <VStack gap={6} align="stretch">
              {/* Progress Bars */}
              <Box bg="var(--card)" borderRadius="xl" p={6} shadow="md">
                <VStack gap={4} align="stretch">
                  {/* Barra 1 - Cartão de Crédito */}
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="var(--muted-foreground)">disponível</Text>
                      <Text fontSize="lg" fontWeight="bold" color="var(--muted-foreground)">
                        {formatCurrency(totals.availableBalance)}
                      </Text>
                    </HStack>
                    <Progress.Root value={60} size="lg" colorPalette="green">
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="var(--muted-foreground)">atual</Text>
                      <Text fontSize="lg" fontWeight="bold" color="var(--muted-foreground)">
                        {formatCurrency(totals.lockedBalance)}
                      </Text>
                    </HStack>
                    <Progress.Root value={40} size="lg" colorPalette="blue">
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="var(--muted-foreground)">próximas</Text>
                      <Text fontSize="lg" fontWeight="bold" color="var(--muted-foreground)">
                        {formatCurrency(totals.emergencyReserve)}
                      </Text>
                    </HStack>
                    <Progress.Root value={30} size="lg" colorPalette="orange">
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>

                  <VStack align="stretch" gap={2} mt={4} fontSize="xs" color="var(--muted-foreground)">
                    <Text>Gastos: gastos referentes ao mês de Dezembro</Text>
                    <Text>Cartão final: XXX XXX XXX 1510</Text>
                    <Text>Bandeira: Master Card Platinum</Text>
                  </VStack>
                </VStack>
              </Box>

              {/* Bfinconta Info */}
              <Box bg="var(--card)" borderRadius="xl" p={6} shadow="md">
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="var(--muted-foreground)">saldo disponível</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="var(--muted-foreground)">
                      {formatCurrency(totals.availableBalance)}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="var(--muted-foreground)">total investido</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="var(--muted-foreground)">
                      {formatCurrency(totals.emergencyReserve)}
                    </Text>
                  </HStack>

                  <Progress.Root value={70} size="lg" colorPalette="green" mt={4}>
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>

                  <VStack align="stretch" gap={1} mt={4} fontSize="xs" color="var(--muted-foreground)">
                    <Text><Text as="span" color="var(--accent)" fontWeight="bold">Em azul:</Text> representa o valor atual em sua conta corrente</Text>
                    <Text><Text as="span" color="green.500" fontWeight="bold">Em verde:</Text> representa todos os seus investimentos</Text>
                  </VStack>
                </VStack>
              </Box>

            </VStack>
          </Grid>
          )}

          {/* Footer - Actions */}
          <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            bg="var(--primary)"
            boxShadow={customShadows.whiteGlow.top}
            px={8}
            py={2}
            zIndex={15}
            h="90px"
          >
            <Flex justify="space-between" align="stretch" gap={2} h="full">
              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                onClick={() => setExpandedForm(expandedForm === 'pagar' ? null : 'pagar')}
                gap={1}
              >
                <BarChart3 size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Pagar</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                gap={1}
                onClick={() => setExpandedForm(expandedForm === 'bfin-parceiro' ? null : 'bfin-parceiro')}
              >
                <Users size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Bfin Parceiro</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                onClick={() => setExpandedForm(expandedForm === 'transferir' ? null : 'transferir')}
                gap={1}
              >
                <Send size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Transferir</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                onClick={() => setExpandedForm(expandedForm === 'depositar' ? null : 'depositar')}
                gap={1}
              >
                <Download size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Depositar</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                onClick={() => setExpandedForm(expandedForm === 'emprestimos' ? null : 'emprestimos')}
                gap={1}
              >
                <DollarSign size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Empréstimos</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                gap={1}
                onClick={() => setExpandedForm(expandedForm === 'agendar-pagamento' ? null : 'agendar-pagamento')}
              >
                <Calendar size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Agendar pagamento</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                onClick={() => setExpandedForm(expandedForm === 'recarga-celular' ? null : 'recarga-celular')}
                gap={1}
              >
                <Smartphone size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Recarga de celular</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="whiteAlpha.200"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
                onClick={() => setExpandedForm(expandedForm === 'ajustar-limite' ? null : 'ajustar-limite')}
                gap={1}
              >
                <Sliders size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Ajustar limite</Text>
              </Box>
            </Flex>
          </Box>
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
