import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  IconButton,
  Dialog,
  Alert,
  Stack,
  List,
  Tooltip,
  Icon,
  Grid,
  Separator,
} from '@chakra-ui/react';
import { Button } from '../components/atoms/Button';
import { CreateAccountForm } from '../components/organisms/forms';
import { AccountsDialog, InvitationsDialog } from '../components/organisms/dialogs';
import { SpendingHistoryChart } from '../components/organisms/charts';
import { useAccounts } from '../hooks/useAccounts';
import { useTotalDailyLimit } from '../hooks/useDailyLimit';
import { useUpcomingFixedExpenses, useMarkAsPaid } from '../hooks/useTransactions';
import { useMyInvitations } from '../hooks/useAccountMembers';
import {
  Shield,
  Calendar,
  ShoppingCart,
  Wallet,
  Mail,
  Home,
  Settings,
  Eye,
  CreditCard,
  DollarSign,
  Gift,
  Users,
  Send,
  Download,
  Smartphone,
  Sliders,
  BarChart3,
  X
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { confirm } from '../components/ui/ConfirmDialog';
import { toast } from '../lib/toast';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [manageAccountsDialogOpen, setManageAccountsDialogOpen] = useState(false);
  const [emergencyReserveDialogOpen, setEmergencyReserveDialogOpen] = useState(false);
  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: invitations = [] } = useMyInvitations();

  const accountIds = accounts?.map((acc) => acc.id) || [];
  const { data: dailyLimit, isLoading: loadingDailyLimit } = useTotalDailyLimit(accountIds);
  const { data: upcomingExpenses, isLoading: loadingUpcomingExpenses } = useUpcomingFixedExpenses();
  const markAsPaid = useMarkAsPaid();

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  async function handleMarkAsPaid(id: string, description: string) {
    const confirmed = await confirm({
      title: 'Marcar como Paga',
      description: `Deseja marcar "${description}" como paga?`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      colorPalette: 'green',
    });

    if (confirmed) {
      try {
        await markAsPaid.mutateAsync(id);
        toast.success('Despesa marcada como paga!');
      } catch (error: any) {
        toast.error('Erro ao marcar como paga', error.response?.data?.error);
      }
    }
  }

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
        borderBottomWidth="1px"
        borderBottomColor="rgba(255,255,255,0.1)"
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
            _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
          borderRightWidth="1px"
          borderRightColor="rgba(255,255,255,0.1)"
          position="relative"
          zIndex={1}
        >
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton
                aria-label="Home"
                variant="ghost"
                color="var(--primary-foreground)"
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                size="lg"
                border="none"
                _focus={{ boxShadow: 'none' }}
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
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
            zIndex={10}
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
                    bg="white"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xs" color="gray.600">QR Code</Text>
                  </Box>
                </Flex>

                <VStack align="flex-start" gap={0} fontSize="xs" color="var(--primary-foreground)" opacity={0.8}>
                  <Text>Agência: 0001</Text>
                  <Text>Conta: 1000001-0</Text>
                  <Text>Banco: 260 - NU Pagamentos S.A.</Text>
                </VStack>
              </VStack>

              <Separator borderColor="rgba(255,255,255,0.2)" />

              {/* Menu Options */}
              <VStack gap={2} align="stretch">
                <Button
                  variant="ghost"
                  color="var(--primary-foreground)"
                  justifyContent="space-between"
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
                  _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
                borderColor="rgba(255,255,255,0.3)"
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
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
          <Grid
            templateColumns={{ base: '1fr', lg: '440px 1fr' }}
            gap={6}
            p={8}
            pb="140px"
            flex="1"
          >
            {/* Left Column - Cards */}
            <VStack gap={4} align="stretch">
              {/* Card Cartão de Crédito */}
              <Box
                bg="var(--card)"
                borderRadius="xl"
                p={6}
                shadow="md"
              >
                <HStack mb={4}>
                  <CreditCard size={20} color="var(--card-foreground)" />
                  <Text color="var(--card-foreground)" fontWeight="medium">
                    Cartão de Crédito
                  </Text>
                </HStack>

                <Box mb={4}>
                  <Text fontSize="xs" color="var(--muted-foreground)" mb={1}>
                    Fatura atual
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="var(--accent)">
                    {loadingAccounts ? 'Carregando...' : formatCurrency(totals.lockedBalance)}
                  </Text>
                  <Text fontSize="sm" color="var(--muted-foreground)" mt={1}>
                    Limite disponível: <Text as="span" color="var(--accent)" fontWeight="medium">{formatCurrency(totals.availableBalance)}</Text>
                  </Text>
                </Box>

                <Button
                  size="md"
                  bg="var(--primary)"
                  color="var(--primary-foreground)"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => navigate('/transactions')}
                >
                  VER COMPRAS
                </Button>
              </Box>

              {/* Card Nuconta */}
              <Box
                bg="var(--card)"
                borderRadius="xl"
                p={6}
                shadow="md"
              >
                <HStack mb={4}>
                  <DollarSign size={20} color="var(--card-foreground)" />
                  <Text color="var(--card-foreground)" fontWeight="medium">
                    Nuconta
                  </Text>
                </HStack>

                <Box mb={4}>
                  <Text fontSize="xs" color="var(--muted-foreground)" mb={1}>
                    Saldo disponível
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="var(--accent)">
                    {loadingAccounts ? 'Carregando...' : formatCurrency(totals.availableBalance)}
                  </Text>
                  <Text fontSize="sm" color="var(--muted-foreground)" mt={1}>
                    Valor investido: <Text as="span" color="var(--accent)" fontWeight="medium">{formatCurrency(totals.emergencyReserve)}</Text>
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

              {/* Card Rewards */}
              <Box
                bg="var(--card)"
                borderRadius="xl"
                p={6}
                shadow="md"
              >
                <HStack>
                  <Gift size={20} color="var(--card-foreground)" />
                  <Text color="var(--card-foreground)" fontWeight="medium">
                    Rewards
                  </Text>
                </HStack>
              </Box>

              {/* Daily Limit Alert - Moved below */}
          {!loadingDailyLimit && !loadingAccounts && dailyLimit && dailyLimit.totalDailyLimit > 0 && (
            <Flex justify="flex-end">
              <Box
                as="button"
                onClick={() => navigate('/daily-limit')}
                w={{ base: 'full', md: '40%' }}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              >
                <Alert.Root
                  status={
                    dailyLimit.exceeded
                      ? 'error'
                      : dailyLimit.percentageUsed > 80
                      ? 'warning'
                      : 'success'
                  }
                  variant="outline"
                  borderRadius="lg"
                >
                  <Alert.Indicator />
                  <Alert.Title>
                    <VStack gap={2} align="stretch" w="full">
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" fontWeight="semibold">
                          Limite Diário Sugerido
                        </Text>
                        <Text fontSize="xs" opacity={0.8}>
                          ▶ Ver detalhes
                        </Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="xs" opacity={0.9}>
                        <Text>Gasto hoje</Text>
                        <Text fontWeight="medium">
                          {formatCurrency(dailyLimit.totalSpentToday)} / {formatCurrency(dailyLimit.totalDailyLimit)}
                        </Text>
                      </Flex>
                      <Progress.Root
                        value={Math.min(100, dailyLimit.percentageUsed)}
                        colorPalette={
                          dailyLimit.exceeded
                            ? 'red'
                            : dailyLimit.percentageUsed > 80
                            ? 'yellow'
                            : 'green'
                        }
                        size="sm"
                        shape="full"
                      >
                        <Progress.Track>
                          <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                      <Text fontSize="xs">
                        {dailyLimit.exceeded ? (
                          <Text as="span" fontWeight="medium">
                            Excedido em {formatCurrency(dailyLimit.totalSpentToday - dailyLimit.totalDailyLimit)}
                          </Text>
                        ) : (
                          <Text as="span">
                            Restam {formatCurrency(dailyLimit.totalRemaining)} hoje
                          </Text>
                        )}
                      </Text>
                    </VStack>
                  </Alert.Title>
                </Alert.Root>
              </Box>
            </Flex>
          )}

          {/* Quick Actions */}
          {!loadingAccounts && accounts && accounts.length > 0 && (
            <HStack gap={4} justify="flex-start">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    aria-label="Nova Despesa Fixa"
                    onClick={() => navigate('/add-fixed-expense')}
                    colorPalette="orange"
                    size="lg"
                    borderRadius="xl"
                  >
                    <Icon as={Calendar} boxSize={6} />
                  </IconButton>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content>Nova Despesa Fixa</Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    aria-label="Nova Despesa Variável"
                    onClick={() => navigate('/add-variable-expense')}
                    colorPalette="red"
                    size="lg"
                    borderRadius="xl"
                  >
                    <Icon as={ShoppingCart} boxSize={6} />
                  </IconButton>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content>Nova Despesa Variável</Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
            </HStack>
          )}

          {/* Available Balance Card */}
          <Box
            bg={{ base: 'card', _dark: 'card' }}
            borderRadius="lg"
            shadow="md"
            p={6}
            borderWidth="1px"
            borderColor={{ base: 'border', _dark: 'border' }}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color={{ base: 'muted.fg', _dark: 'muted.fg' }}>
                Saldo Disponível
              </Text>
              <IconButton
                aria-label="Ver Reserva de Emergência"
                onClick={() => setEmergencyReserveDialogOpen(true)}
                size="sm"
                variant="ghost"
                colorPalette="blue"
              >
                <Shield size={20} />
              </IconButton>
            </Flex>
            <Box
              as="button"
              onClick={() => navigate('/transactions')}
              cursor="pointer"
              textAlign="left"
              w="full"
            >
              <Text fontSize="4xl" fontWeight="bold" color={{ base: 'green.600', _dark: 'green.400' }} mt={2}>
                {loadingAccounts ? 'Carregando...' : formatCurrency(totals.availableBalance)}
              </Text>
              <Text fontSize="sm" color={{ base: 'muted.fg', _dark: 'muted.fg' }} mt={1}>
                Para gastos · Clique para ver todas as transações
              </Text>
            </Box>
          </Box>

          {/* Upcoming Expenses */}
          <Box
            bg={{ base: 'card', _dark: 'card' }}
            borderRadius="lg"
            shadow="md"
            p={6}
            borderWidth="1px"
            borderColor={{ base: 'border', _dark: 'border' }}
          >
            <Heading size="md" color={{ base: 'fg', _dark: 'fg' }} mb={4}>
              Próximas Despesas Fixas
            </Heading>
            {loadingUpcomingExpenses ? (
              <Text color={{ base: 'muted.fg', _dark: 'muted.fg' }}>Carregando...</Text>
            ) : !upcomingExpenses?.transactions || upcomingExpenses.transactions.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color={{ base: 'muted.fg', _dark: 'muted.fg' }}>Nenhuma despesa agendada</Text>
              </Box>
            ) : (
              <VStack gap={3} align="stretch">
                {upcomingExpenses.transactions.map((expense) => {
                  const dueDate = new Date(expense.due_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  dueDate.setHours(0, 0, 0, 0);
                  const isOverdue = dueDate < today;

                  return (
                    <Flex
                      key={expense.id}
                      align="center"
                      justify="space-between"
                      p={4}
                      borderWidth="1px"
                      borderColor={{ base: 'border', _dark: 'border' }}
                      borderRadius="lg"
                      bg={{ base: 'transparent', _dark: 'transparent' }}
                      _hover={{ bg: { base: 'accent/10', _dark: 'accent/10' } }}
                      transition="all 0.2s"
                    >
                      <Box flex="1">
                        <Text fontWeight="medium" color={{ base: 'fg', _dark: 'fg' }}>
                          {expense.description}
                        </Text>
                        {expense.category && (
                          <Text fontSize="sm" color={{ base: 'muted.fg', _dark: 'muted.fg' }} mt={1}>
                            {expense.category.name}
                          </Text>
                        )}
                      </Box>
                      <VStack align="flex-end" ml={4} gap={1}>
                        <Text fontWeight="bold" color={{ base: 'red.600', _dark: 'red.400' }}>
                          {formatCurrency(expense.amount)}
                        </Text>
                        <Text
                          fontSize="sm"
                          color={isOverdue ? { base: 'red.600', _dark: 'red.400' } : { base: 'muted.fg', _dark: 'muted.fg' }}
                          fontWeight={isOverdue ? 'semibold' : 'normal'}
                        >
                          {isOverdue ? 'Vencida: ' : 'Vencimento: '}
                          {new Date(expense.due_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Text>
                        <Button
                          size="sm"
                          variant="outline"
                          colorPalette="green"
                          onClick={() => handleMarkAsPaid(expense.id, expense.description)}
                        >
                          Marcar como Paga
                        </Button>
                      </VStack>
                    </Flex>
                  );
                })}
              </VStack>
            )}
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
                      <Text fontSize="lg" fontWeight="bold" color="var(--card-foreground)">
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
                      <Text fontSize="lg" fontWeight="bold" color="var(--card-foreground)">
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
                      <Text fontSize="lg" fontWeight="bold" color="var(--card-foreground)">
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

              {/* Nuconta Info */}
              <Box bg="var(--card)" borderRadius="xl" p={6} shadow="md">
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="var(--muted-foreground)">saldo disponível</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="var(--card-foreground)">
                      {formatCurrency(totals.availableBalance)}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="var(--muted-foreground)">total investido</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="var(--card-foreground)">
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

              {/* Rewards Info */}
              <Box bg="var(--card)" borderRadius="xl" p={6} shadow="md">
                <Text fontSize="sm" color="var(--card-foreground)">
                  R$ 1,00 = 1 Ponto
                </Text>
              </Box>
            </VStack>
          </Grid>

          {/* Footer - Actions */}
          <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            bg="var(--primary)"
            borderTopWidth="1px"
            borderTopColor="rgba(255,255,255,0.1)"
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
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                onClick={() => navigate('/add-variable-expense')}
                gap={1}
              >
                <BarChart3 size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Pagar</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                gap={1}
              >
                <Users size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Indicar amigos</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                gap={1}
              >
                <Send size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Transferir</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                onClick={() => navigate('/add-income')}
                gap={1}
              >
                <Download size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Depositar</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                gap={1}
              >
                <DollarSign size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Empréstimos</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                gap={1}
              >
                <CreditCard size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Cartão virtual</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                gap={1}
              >
                <Smartphone size={22} color="var(--primary-foreground)" />
                <Text color="var(--primary-foreground)" fontSize="2xs">Recarga de celular</Text>
              </Box>

              <Box
                flex="1"
                h="full"
                borderRadius="xl"
                bg="rgba(255,255,255,0.15)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                transition="all 0.2s"
                onClick={() => navigate('/daily-limit')}
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
                <Shield size={20} color="#2563EB" />
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
    </Flex>
  );
}
