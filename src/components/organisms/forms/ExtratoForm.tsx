import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  HStack,
  Link as ChakraLink,
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
  Receipt,
} from 'lucide-react';
import { BaseForm } from '../../ui/BaseForm';
import { useAccounts } from '../../../hooks/useAccounts';
import { useTransactions } from '../../../hooks/useTransactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '../../../types/transaction';

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
    <Box bg="var(--card)" borderRadius="xl" p={4} shadow="sm">
      <Flex align="center" justify="space-between">
        <HStack gap={4}>
          <Center bg="green.50" boxSize="12" borderRadius="xl">
            <Icon as={icon} color="green.500" boxSize={6} />
          </Center>
          <VStack align="flex-start" gap={0}>
            <Text fontWeight="bold" color="var(--foreground)" fontSize="md">
              {title}
            </Text>
            <Text color="var(--muted-foreground)" fontSize="sm">
              {date}
            </Text>
          </VStack>
        </HStack>

        <VStack align="flex-end" gap={0}>
          <Text
            fontWeight="bold"
            color={isIncome ? 'green.500' : 'var(--foreground)'}
            fontSize="lg"
          >
            {isIncome ? '+ ' : '- '}
            {formatCurrency(Math.abs(amount))}
          </Text>
          <Text color="var(--muted-foreground)" fontSize="xs">
            {type}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

interface ExtratoFormProps {
  onBack?: () => void;
  onViewAll?: () => void;
  onCancel?: () => void;
}

export function ExtratoForm({ onBack, onViewAll, onCancel }: ExtratoFormProps) {
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
    if (transaction.type === 'fixed') return 'Boleto';
    if (transaction.type === 'variable') return 'Débito';
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

  const viewAllColor = onViewAll ? 'var(--primary)' : 'green.500';

  return (
    <BaseForm
      variant="green-header"
      title="Extrato da Conta"
      icon={Receipt}
      isLoading={loadingAccounts}
      displayValue={{
        value: loadingAccounts ? '...' : formatCurrency(totals.availableBalance),
        label: 'Saldo em Conta',
        editable: true,
        onEdit: () => setShowBalance(!showBalance),
      }}
      headerContent={
        <Icon
          as={showBalance ? Eye : EyeOff}
          boxSize={6}
          color="var(--primary-foreground)"
          cursor="pointer"
          onClick={() => setShowBalance(!showBalance)}
          _hover={{ opacity: 0.8 }}
        />
      }
      onBack={onBack}
      onCancel={onCancel}
    >

      {/* Floating Action Card */}
      <Box px={4} mt="-10" mb={6}>
        <Box bg="var(--card)" borderRadius="2xl" p={6} shadow="xl">
          <Flex justify="space-between" align="center">
            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={TrendingUp} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Investimentos</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={ArrowLeftRight} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Transferir</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={Banknote} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Pagar</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={QrCode} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Pix</Text>
            </VStack>
          </Flex>
        </Box>
      </Box>

      {/* Recent Transactions Section */}
      <VStack align="stretch" gap={4} px={6} pb={24}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color="var(--foreground)">
            Extrato Recente
          </Text>
          {onViewAll && (
            <ChakraLink color={viewAllColor} fontWeight="bold" fontSize="sm" onClick={onViewAll}>
              Ver tudo
            </ChakraLink>
          )}
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
              date={transaction.due_date ? formatDateLabel(transaction.due_date) : '-'}
              amount={Number(transaction.amount)}
              type={getTypeLabel(transaction)}
              icon={getTransactionIcon(transaction.description, transaction.type)}
              isIncome={transaction.type === 'income'}
            />
          ))}

          {!loadingTransactions && transactionsData?.transactions.length === 0 && (
            <Center py={10}>
              <Text color="var(--muted-foreground)">Nenhuma transação recente</Text>
            </Center>
          )}
        </VStack>
      </VStack>
    </BaseForm>
  );
}