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
import { TrendingUp, TrendingDown, Calendar, AlertCircle } from 'lucide-react';
import { BaseForm } from '../../ui/BaseForm';
import { CalendarHeader } from '../../molecules/CalendarHeader';
import { formatCurrency } from '../../../utils';
import { useAccountSelection } from '../../../hooks/useAccountSelection';
import { useMonthlyCashFlow } from '../../../hooks/useMonthlyCashFlow';
import type { DailyCashFlow } from '../../../types/cashflow';

interface HistFinanFormProps {
  onBack?: () => void;
  onCancel?: () => void;
}


export function HistFinanForm({ onBack, onCancel }: HistFinanFormProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { selectedAccountId } = useAccountSelection();

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Buscar dados do cash flow mensal da API
  const {
    data: cashFlowData,
    isLoading,
    error
  } = useMonthlyCashFlow({
    accountId: selectedAccountId,
    year: currentYear,
    month: currentMonth
  });

  // Navegação entre meses
  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Componente de linha da tabela atualizado para dados da API
  const TableRow = React.memo(({ dayData, index }: { dayData: DailyCashFlow; index: number }) => {
    const date = new Date(dayData.date);
    const day = date.getDate();
    const hasMovement = dayData.dailyIncome > 0 || dayData.dailyExpenses > 0 || dayData.floatingDebtPayment > 0;

    const balanceColor = useMemo(() =>
      dayData.balance >= 0 ? 'var(--success)' : 'var(--destructive)',
      [dayData.balance]
    );

    const formattedDay = useMemo(() =>
      day.toString().padStart(2, '0'),
      [day]
    );

    const formattedBalance = useMemo(() =>
      formatCurrency(dayData.balance),
      [dayData.balance]
    );

    return (
      <Table.Row key={index} _hover={{ bg: 'var(--muted)' }} opacity={hasMovement ? 1 : 0.6}>
        <Table.Cell py={4}>
          <Text fontWeight="medium" color="var(--foreground)">
            {formattedDay}
          </Text>
        </Table.Cell>

        <Table.Cell py={4}>
          <VStack gap={1} align="start">
            {/* Receitas do dia */}
            {dayData.dailyIncome > 0 && (
              <HStack gap={2}>
                <TrendingUp size={14} color="var(--success)" />
                <Badge colorPalette="green" variant="subtle" size="sm">
                  Entrada
                </Badge>
                <Text fontSize="sm" color="var(--success)" fontWeight="medium">
                  +{formatCurrency(dayData.dailyIncome)}
                </Text>
              </HStack>
            )}

            {/* Despesas do dia */}
            {dayData.dailyExpenses > 0 && (
              <HStack gap={2}>
                <TrendingDown size={14} color="var(--destructive)" />
                <Badge colorPalette="red" variant="subtle" size="sm">
                  Saída
                </Badge>
                <Text fontSize="sm" color="var(--destructive)" fontWeight="medium">
                  -{formatCurrency(dayData.dailyExpenses)}
                </Text>
              </HStack>
            )}

            {/* Pagamento de dívida flutuante */}
            {dayData.floatingDebtPayment > 0 && (
              <HStack gap={2}>
                <AlertCircle size={14} color="var(--warning)" />
                <Badge colorPalette="orange" variant="subtle" size="sm">
                  Dívida
                </Badge>
                <Text fontSize="sm" color="var(--warning)" fontWeight="medium">
                  -{formatCurrency(dayData.floatingDebtPayment)}
                </Text>
              </HStack>
            )}

            {/* Se não há movimento */}
            {!hasMovement && (
              <Text fontSize="sm" color="var(--muted-foreground)">
                Sem movimentação
              </Text>
            )}
          </VStack>
        </Table.Cell>

        <Table.Cell py={4} textAlign="right">
          <VStack gap={1} align="end">
            <Text fontWeight="bold" color={balanceColor} fontSize="md">
              {formattedBalance}
            </Text>
            {dayData.remainingFloatingDebt > 0 && (
              <Text fontSize="xs" color="var(--muted-foreground)">
                Dívida: {formatCurrency(dayData.remainingFloatingDebt)}
              </Text>
            )}
          </VStack>
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

            {/* Resumo Mensal */}
            {cashFlowData && (
              <VStack gap={4} mb={6}>
                <HStack justify="space-between" w="full">
                  <Box>
                    <Text fontSize="sm" color="var(--muted-foreground)" mb={1}>
                      Saldo Inicial
                    </Text>
                    <Text fontWeight="bold" fontSize="lg">
                      {formatCurrency(cashFlowData.startBalance)}
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="sm" color="var(--muted-foreground)" mb={1}>
                      {cashFlowData.isHistorical ? 'Histórico' : 'Projeção'}
                    </Text>
                    <Badge colorPalette={cashFlowData.isHistorical ? 'blue' : 'orange'} variant="subtle">
                      {cashFlowData.isHistorical ? 'Real' : 'Simulado'}
                    </Badge>
                  </Box>
                  <Box textAlign="right">
                    <Text fontSize="sm" color="var(--muted-foreground)" mb={1}>
                      Saldo Final
                    </Text>
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color={cashFlowData.endBalance >= 0 ? 'var(--success)' : 'var(--destructive)'}
                    >
                      {formatCurrency(cashFlowData.endBalance)}
                    </Text>
                  </Box>
                </HStack>

                {/* Informações sobre dívidas flutuantes */}
                {cashFlowData.totalFloatingDebt > 0 && (
                  <Box p={4} bg="var(--warning-subtle)" borderRadius="lg" w="full">
                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="var(--warning)">
                          Dívidas Flutuantes
                        </Text>
                        <Text fontSize="xs" color="var(--muted-foreground)">
                          Total: {formatCurrency(cashFlowData.totalFloatingDebt)}
                        </Text>
                      </VStack>
                      <VStack align="end" gap={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="var(--warning)">
                          Restante no Final
                        </Text>
                        <Text fontSize="xs" color="var(--muted-foreground)">
                          {formatCurrency(cashFlowData.remainingFloatingDebtAtEnd)}
                        </Text>
                      </VStack>
                    </HStack>
                    {cashFlowData.debtFreeDate && (
                      <Text fontSize="xs" color="var(--success)" mt={2}>
                        📅 Quitação prevista: {new Date(cashFlowData.debtFreeDate).toLocaleDateString('pt-BR')}
                      </Text>
                    )}
                  </Box>
                )}
              </VStack>
            )}

            {/* Tabela de Histórico */}
            {isLoading ? (
              <VStack gap={2}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} height="60px" borderRadius="md" />
                ))}
              </VStack>
            ) : error ? (
              <Center py={12}>
                <VStack gap={3}>
                  <AlertCircle size={48} color="var(--destructive)" />
                  <Text color="var(--destructive)" fontSize="sm" textAlign="center">
                    Erro ao carregar histórico financeiro
                  </Text>
                  <Text color="var(--muted-foreground)" fontSize="xs" textAlign="center">
                    {selectedAccountId ? 'Tente novamente em alguns instantes' : 'Selecione uma conta primeiro'}
                  </Text>
                </VStack>
              </Center>
            ) : !cashFlowData?.days.length ? (
              <Center py={12}>
                <VStack gap={3}>
                  <Calendar size={48} color="var(--muted-foreground)" />
                  <Text color="var(--muted-foreground)" fontSize="sm">
                    Nenhum dado encontrado para este mês
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
                        minW="60px"
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
                        Movimentações
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="var(--muted-foreground)"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        py={3}
                        textAlign="right"
                        minW="120px"
                      >
                        Saldo do Dia
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {cashFlowData.days.map((dayData, index) => (
                      <TableRow key={dayData.date} dayData={dayData} index={index} />
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