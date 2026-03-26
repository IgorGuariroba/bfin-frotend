import React, { useState, useMemo, useCallback } from 'react';
import {
  Container,
  Box,
  VStack,
  HStack,
  Text,
  Table,
  Skeleton,
  Badge,
  Center,
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { BaseForm } from '../../ui/BaseForm';
import { CalendarHeader } from '../../molecules/CalendarHeader';
import { formatCurrency } from '../../../utils';

// Constants to avoid stringly-typed code
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  BALANCE: 'balance'
} as const;

type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

interface HistFinanFormProps {
  onBack?: () => void;
  onCancel?: () => void;
}

interface DailyBalance {
  day: number;
  type: TransactionType;
  amount: number;
  balance: number;
}

// Memoized type display configurations to avoid recreating objects
const TYPE_DISPLAY_CONFIG = {
  [TRANSACTION_TYPES.INCOME]: {
    icon: <TrendingUp size={14} />,
    label: 'Entrada',
    color: 'green',
  },
  [TRANSACTION_TYPES.EXPENSE]: {
    icon: <TrendingDown size={14} />,
    label: 'Saída',
    color: 'red',
  },
  [TRANSACTION_TYPES.BALANCE]: {
    icon: null,
    label: 'Saldo',
    color: 'gray',
  },
} as const;

// Mock data para demonstração - será substituído por dados reais da API
const generateMockData = (month: number, year: number): DailyBalance[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const data: DailyBalance[] = [];
  let runningBalance = 1500; // Saldo inicial fictício

  for (let day = 1; day <= daysInMonth; day++) {
    // Simula algumas transações aleatórias
    const hasTransaction = Math.random() > 0.6;
    if (hasTransaction) {
      const isIncome = Math.random() > 0.4;
      const amount = Math.floor(Math.random() * 500) + 50;

      if (isIncome) {
        runningBalance += amount;
        data.push({
          day,
          type: TRANSACTION_TYPES.INCOME,
          amount,
          balance: runningBalance,
        });
      } else {
        runningBalance -= amount;
        data.push({
          day,
          type: TRANSACTION_TYPES.EXPENSE,
          amount,
          balance: runningBalance,
        });
      }
    }
  }

  return data;
};

export function HistFinanForm({ onBack, onCancel }: HistFinanFormProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Memoize expensive data generation to avoid recalculation on every render
  const dailyBalances = useMemo(() =>
    generateMockData(currentMonth, currentYear),
    [currentMonth, currentYear]
  );

  // Navegação entre meses usando date-fns para maior robustez
  const handlePrevMonth = useCallback(() => {
    setIsLoading(true);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);

    // Simula loading
    setTimeout(() => setIsLoading(false), 300);
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setIsLoading(true);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);

    // Simula loading
    setTimeout(() => setIsLoading(false), 300);
  }, [currentDate]);

  const handleToday = useCallback(() => {
    setIsLoading(true);
    setCurrentDate(new Date());

    // Simula loading
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Simplified type display function using pre-defined config
  const getTypeDisplay = useCallback((type: DailyBalance['type']) => {
    return TYPE_DISPLAY_CONFIG[type];
  }, []);

  // Memoized table row component to prevent unnecessary re-renders
  const TableRow = React.memo(({ item, index }: { item: DailyBalance; index: number }) => {
    const typeInfo = getTypeDisplay(item.type);

    // Memoize color calculations
    const amountColor = useMemo(() => {
      if (item.type === TRANSACTION_TYPES.INCOME) return 'var(--success)';
      if (item.type === TRANSACTION_TYPES.EXPENSE) return 'var(--destructive)';
      return 'var(--muted-foreground)';
    }, [item.type]);

    const balanceColor = useMemo(() =>
      item.balance >= 0 ? 'var(--success)' : 'var(--destructive)',
      [item.balance]
    );

    const formattedDay = useMemo(() =>
      item.day.toString().padStart(2, '0'),
      [item.day]
    );

    const formattedAmount = useMemo(() =>
      item.type !== TRANSACTION_TYPES.BALANCE ? formatCurrency(Math.abs(item.amount)) : '',
      [item.type, item.amount]
    );

    const formattedBalance = useMemo(() =>
      formatCurrency(item.balance),
      [item.balance]
    );

    return (
      <Table.Row key={index} _hover={{ bg: 'var(--muted)' }}>
        <Table.Cell py={4}>
          <Text fontWeight="medium" color="var(--foreground)">
            {formattedDay}
          </Text>
        </Table.Cell>

        <Table.Cell py={4}>
          <HStack gap={2}>
            {typeInfo.icon}
            <Badge
              colorPalette={typeInfo.color}
              variant="subtle"
              size="sm"
            >
              {typeInfo.label}
            </Badge>
            <Text
              fontSize="sm"
              color={amountColor}
              fontWeight="medium"
            >
              {item.type !== TRANSACTION_TYPES.BALANCE && (
                <>
                  {item.type === TRANSACTION_TYPES.INCOME ? '+' : '-'}
                  {formattedAmount}
                </>
              )}
            </Text>
          </HStack>
        </Table.Cell>

        <Table.Cell py={4} textAlign="right">
          <Text
            fontWeight="bold"
            color={balanceColor}
            fontSize="md"
          >
            {formattedBalance}
          </Text>
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <BaseForm
      variant="green-header"
      title="Histórico Financeiro"
      subtitle="Acompanhe o movimento diário da sua conta"
      icon={Calendar}
      onBack={onBack}
      onCancel={onCancel}
    >
      <Container maxW="7xl" py={8} pb={{ base: 28, md: 20 }} mt={{ base: -10, md: -12 }}>
        <VStack gap={6} align="stretch">
          {/* Navegação de Mês/Ano */}
          <Box
            bg="var(--card)"
            borderRadius="2xl"
            boxShadow="var(--shadow-md)"
            p={{ base: 4, md: 6 }}
          >
            <CalendarHeader
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              isLoading={isLoading}
            />

            {/* Tabela de Histórico */}
            {isLoading ? (
              <VStack gap={2}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height="48px" borderRadius="md" />
                ))}
              </VStack>
            ) : dailyBalances.length === 0 ? (
              <Center py={12}>
                <VStack gap={3}>
                  <Calendar size={48} color="var(--muted-foreground)" />
                  <Text color="var(--muted-foreground)" fontSize="sm">
                    Nenhuma movimentação encontrada neste mês
                  </Text>
                </VStack>
              </Center>
            ) : (
              <Box overflowX="auto">
                <Table.Root variant="line" size="md">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader
                        color="var(--muted-foreground)"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        py={3}
                      >
                        Dia
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="var(--muted-foreground)"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        py={3}
                      >
                        Tipo
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="var(--muted-foreground)"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        py={3}
                        textAlign="right"
                      >
                        Saldo do Dia
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {dailyBalances.map((item, index) => (
                      <TableRow key={index} item={item} index={index} />
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </BaseForm>
  );
}