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
} from '@chakra-ui/react';
import { Button } from '../components/atoms/Button';
import { CreateAccountForm } from '../components/organisms/forms';
import { AccountsDialog, InvitationsDialog } from '../components/organisms/dialogs';
import { TransactionList } from '../components/organisms/lists';
import { SpendingHistoryChart } from '../components/organisms/charts';
import { useAccounts } from '../hooks/useAccounts';
import { useTotalDailyLimit } from '../hooks/useDailyLimit';
import { useUpcomingFixedExpenses, useMarkAsPaid } from '../hooks/useTransactions';
import { useMyInvitations } from '../hooks/useAccountMembers';
import { Shield, TrendingUp, Calendar, ShoppingCart, Wallet, Mail } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { confirm } from '../components/ui/ConfirmDialog';
import { toast } from '../lib/toast';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [manageAccountsDialogOpen, setManageAccountsDialogOpen] = useState(false);
  const [transactionsDialogOpen, setTransactionsDialogOpen] = useState(false);
  const [emergencyReserveDialogOpen, setEmergencyReserveDialogOpen] = useState(false);
  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);
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
    <Box minH="100vh" bg="var(--background)">
      {/* Header */}
      <Box as="header" bg={{ base: 'card', _dark: 'card' }} shadow="sm" borderBottomWidth="1px" borderBottomColor={{ base: 'border', _dark: 'border' }}>
        <Container maxW="7xl" py={4}>
          <Flex align="center" justify="space-between">
            <HStack gap={4}>
              <Heading size="lg" color={{ base: 'brand.600', _dark: 'brand.400' }}>BFIN</Heading>
              <Text color={{ base: 'muted.fg', _dark: 'muted.fg' }}>Dashboard</Text>
            </HStack>
            <HStack gap={4}>
              <Text color={{ base: 'fg', _dark: 'fg' }} fontWeight="medium">Olá, {user?.full_name}</Text>
              <Box position="relative">
                <Button
                  variant="outline"
                  onClick={() => setInvitationsDialogOpen(true)}
                  borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                  color={{ base: 'gray.700', _dark: 'gray.200' }}
                  _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
                >
                  <Mail size={16} /> Convites
                </Button>
                {invitations.length > 0 && (
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorPalette="red"
                    borderRadius="full"
                    fontSize="xs"
                    px={2}
                  >
                    {invitations.length}
                  </Badge>
                )}
              </Box>
              <Button
                variant="outline"
                onClick={() => setManageAccountsDialogOpen(true)}
                borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                color={{ base: 'gray.700', _dark: 'gray.200' }}
                _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
              >
                <Wallet size={16} /> Gerenciar Contas
              </Button>
              <ThemeToggle variant="icon" size="md" />
              <Button
                variant="outline"
                onClick={handleSignOut}
                borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                color={{ base: 'gray.700', _dark: 'gray.200' }}
                _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
              >
                Sair
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Daily Limit Alert */}
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
                    aria-label="Nova Receita"
                    onClick={() => navigate('/add-income')}
                    colorPalette="green"
                    size="lg"
                    borderRadius="full"
                  >
                    <Icon as={TrendingUp} boxSize={6} />
                  </IconButton>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content>Nova Receita</Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    aria-label="Nova Despesa Fixa"
                    onClick={() => navigate('/add-fixed-expense')}
                    colorPalette="orange"
                    size="lg"
                    borderRadius="full"
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
                    borderRadius="full"
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
              onClick={() => setTransactionsDialogOpen(true)}
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

          {/* Create Account Message */}
          {!loadingAccounts && (!accounts || accounts.length === 0) && (
            <Box
              bg={{ base: 'blue.100', _dark: 'blue.900/30' }}
              borderWidth="1px"
              borderColor={{ base: 'blue.200', _dark: 'blue.700/50' }}
              borderRadius="lg"
              p={6}
            >
              <Heading size="md" color={{ base: 'blue.700', _dark: 'blue.300' }} mb={2}>
                Bem-vindo ao BFIN!
              </Heading>
              <Text color={{ base: 'blue.600', _dark: 'blue.400' }} mb={4}>
                Para começar, você precisa criar uma conta bancária.
              </Text>
              <Button onClick={() => setAccountDialogOpen(true)}>+ Criar Conta</Button>
            </Box>
          )}
        </VStack>
      </Container>

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

      <Dialog.Root open={transactionsDialogOpen} onOpenChange={(e) => setTransactionsDialogOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="4xl">
            <Dialog.Header>
              <Dialog.Title>Todas as Transações</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <TransactionList />
            </Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

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
    </Box>
  );
}
