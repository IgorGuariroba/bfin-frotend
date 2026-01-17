import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  HStack,
  Link as ChakraLink,
  IconButton,
  Center,
  Spinner,
} from '@chakra-ui/react';
import {
  Eye,
  EyeOff,
  TrendingUp,
  ArrowLeftRight,
  Banknote,
  QrCode,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpRight,
  Utensils,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '../../types/transaction';

interface TransactionItemProps {
  title: string;
  date: string;
  amount: number;
  type: string;
  icon: React.ElementType;
  isIncome?: boolean;
}

function TransactionItem({ title, date, amount, type, icon, isIncome }: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box bg="white" borderRadius="xl" p={4} shadow="sm">
      <Flex align="center" justify="space-between">
        <HStack gap={4}>
          <Center bg="green.50" boxSize="12" borderRadius="xl">
            <Icon as={icon} color="green.500" boxSize={6} />
          </Center>
          <VStack align="flex-start" gap={0}>
            <Text fontWeight="bold" color="gray.900" fontSize="md">
              {title}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {date}
            </Text>
          </VStack>
        </HStack>

        <VStack align="flex-end" gap={0}>
          <Text
            fontWeight="bold"
            color={isIncome ? 'green.500' : 'gray.900'}
            fontSize="lg"
          >
            {isIncome ? '+ ' : '- '}
            {formatCurrency(Math.abs(amount))}
          </Text>
          <Text color="gray.400" fontSize="xs">
            {type}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

interface ExtratoProps {
  onBack?: () => void;
}

export function Extrato({ onBack }: ExtratoProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: transactionsData, isLoading: loadingTransactions } = useTransactions({ limit: 10 });
  const [showBalance, setShowBalance] = useState(true);

  const totals = accounts?.reduce(
    (acc, account) => ({
      availableBalance: acc.availableBalance + Number(account.available_balance),
    }),
    { availableBalance: 0 }
  ) || { availableBalance: 0 };

  const formatCurrency = (value: number) => {
    if (!showBalance) return 'R$ ••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTransactionIcon = (description: string, type: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('supermercado')) return ShoppingCart;
    if (desc.includes('restaurante') || desc.includes('sabor')) return Utensils;
    if (desc.includes('energia') || desc.includes('luz')) return Zap;
    if (type === 'income') return ArrowDownLeft;
    return ArrowUpRight;
  };

  const getTypeLabel = (transaction: Transaction) => {
    if (transaction.type === 'income') return 'Transferência';
    if (transaction.type === 'fixed_expense') return 'Boleto';
    if (transaction.type === 'variable_expense') return 'Débito';
    return 'Outros';
  };

  const formatDateLabel = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Hoje';
      if (date.toDateString() === yesterday.toDateString()) return 'Ontem';

      return format(date, "dd MMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <VStack gap={0} align="stretch" w="100%" minH="100vh" bg="gray.50">
      {/* Green Header */}
      <Box bg="var(--primary)" pt={6} pb={16} px={6}>
        {onBack && (
          <IconButton
            aria-label="Voltar"
            variant="ghost"
            color="white"
            onClick={onBack}
            mb={2}
            size="sm"
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <ArrowLeft size={24} />
          </IconButton>
        )}
        <VStack gap={2} align="center">
          <Text color="whiteAlpha.900" fontSize="md" fontWeight="medium">
            Saldo em Conta
          </Text>
          <HStack gap={4}>
            <Text color="white" fontSize="4xl" fontWeight="bold">
              {loadingAccounts ? '...' : formatCurrency(totals.availableBalance)}
            </Text>
            <IconButton
              aria-label="Ver saldo"
              variant="ghost"
              color="white"
              size="sm"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => setShowBalance(!showBalance)}
            >
              <Icon as={showBalance ? Eye : EyeOff} boxSize={6} />
            </IconButton>
          </HStack>
        </VStack>
      </Box>

      {/* Floating Action Card */}
      <Box px={4} mt="-10">
        <Box bg="white" borderRadius="2xl" p={6} shadow="xl">
          <Flex justify="space-between" align="center">
            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={TrendingUp} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="gray.700">Investimentos</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={ArrowLeftRight} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="gray.700">Transferir</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={Banknote} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="gray.700">Pagar</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={QrCode} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="gray.700">Pix</Text>
            </VStack>
          </Flex>
        </Box>
      </Box>

      {/* Recent Transactions Section */}
      <VStack align="stretch" gap={4} p={6} pb={24}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.900">
            Extrato Recente
          </Text>
          <ChakraLink asChild color="green.500" fontWeight="bold" fontSize="sm">
            <RouterLink to="/transactions">
              Ver tudo
            </RouterLink>
          </ChakraLink>
        </Flex>

        <VStack gap={3} align="stretch">
          {loadingTransactions ? (
            <Center py={10}>
              <Spinner color="green.500" />
            </Center>
          ) : transactionsData?.transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              title={transaction.description}
              date={formatDateLabel(transaction.due_date)}
              amount={Number(transaction.amount)}
              type={getTypeLabel(transaction)}
              icon={getTransactionIcon(transaction.description, transaction.type)}
              isIncome={transaction.type === 'income'}
            />
          ))}

          {!loadingTransactions && transactionsData?.transactions.length === 0 && (
            <Center py={10}>
              <Text color="gray.500">Nenhuma transação recente</Text>
            </Center>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
