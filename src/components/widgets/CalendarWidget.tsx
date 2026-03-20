import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
} from '@chakra-ui/react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { BaseWidget } from './BaseWidget';
import { Calendar } from '@/components/organisms/Calendar';
import { CalendarPopover } from '@/components/organisms/CalendarPopover';
import { useCalendar } from '@/hooks/useCalendar';
import { transactionService } from '@/services/transactionService';
import type { CalendarEvent } from '@/types/calendar';
import type { Transaction } from '@/types/transaction';

interface CalendarWidgetProps {
  onViewFullCalendar?: () => void;
  variant?: 'default' | 'compact';
}

// Hook para buscar eventos dos próximos 7 dias
function useUpcomingEvents() {
  const today = startOfDay(new Date());
  const next7Days = endOfDay(addDays(new Date(), 7));

  return useQuery({
    queryKey: ['upcoming-events', format(today, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await transactionService.list({
        startDate: today.toISOString(),
        endDate: next7Days.toISOString(),
      });

      return transformTransactionsToEvents(response.transactions);
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchInterval: 1000 * 60 * 5, // 5 minutos
  });
}

// Transformar transações em eventos
function transformTransactionsToEvents(transactions: Transaction[]): CalendarEvent[] {
  return transactions
    .filter((t): t is Transaction & { due_date: string } => !!t.due_date)
    .map(transaction => ({
      id: transaction.id,
      date: format(new Date(transaction.due_date), 'yyyy-MM-dd'),
      transaction: transaction as CalendarEvent['transaction'],
      type: transaction.type as CalendarEvent['type'],
      amount: Number(transaction.amount) || 0,
      description: transaction.description,
      category: transaction.category?.name || 'Sem categoria',
      status: getTransactionStatus(transaction),
      isRecurring: transaction.is_recurring || false,
      daysUntilDue: getDaysUntilDue(transaction.due_date),
      displayColor: getEventColor(transaction),
    }));
}

function getTransactionStatus(transaction: Transaction): 'pending' | 'paid' | 'overdue' {
  if (transaction.status === 'executed' || transaction.executed_date) return 'paid';
  if (transaction.status === 'cancelled') return 'pending';

  if (!transaction.due_date) return 'pending';
  if (new Date(transaction.due_date) < new Date()) return 'overdue';
  return 'pending';
}

function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getEventColor(transaction: Transaction): CalendarEvent['displayColor'] {
  const status = getTransactionStatus(transaction);
  if (!transaction.due_date) return 'blue';
  const daysUntil = getDaysUntilDue(transaction.due_date);

  if (status === 'paid') return 'green';
  if (status === 'overdue') return 'red';
  if (status === 'pending' && daysUntil <= 3) return 'yellow';
  return 'blue';
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  onViewFullCalendar,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Hook do calendário para o mês atual
  const calendar = useCalendar(new Date(), {});

  // Hook específico para próximos eventos
  const {
    data: upcomingEvents = [],
    isLoading: loadingUpcoming,
    error: upcomingError,
  } = useUpcomingEvents();

  const { getDayEvents, markAsPaid } = calendar;

  const handleViewFullCalendar = () => {
    if (onViewFullCalendar) {
      onViewFullCalendar();
    } else {
      navigate('/calendar');
    }
  };

  const getStatusBadge = (status: CalendarEvent['status']) => {
    const statusMap = {
      paid: { label: 'Pago', colorPalette: 'success' as const },
      pending: { label: 'Pendente', colorPalette: 'warning' as const },
      overdue: { label: 'Vencido', colorPalette: 'error' as const },
    };

    return statusMap[status];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Modo expandido - calendário completo
  if (showFullCalendar) {
    return (
      <BaseWidget
        icon={CalendarIcon}
        title="Calendário de Contas"
        variant={variant}
        primaryAction={{
          label: 'Compacto',
          onClick: () => setShowFullCalendar(false),
          variant: 'outline'
        }}
      >
        <Calendar
          compact={true}
          showFilters={false}
          onDateSelect={setSelectedDate}
          height="400px"
        />
      </BaseWidget>
    );
  }

  // Calcular badge com total de vencimentos
  const overdueCount = upcomingEvents.filter(e => e.status === 'overdue').length;
  const pendingCount = upcomingEvents.filter(e => e.status === 'pending').length;
  const totalEvents = overdueCount + pendingCount;

  return (
    <>
      <BaseWidget
        icon={CalendarIcon}
        title="Calendário"
        subtitle="Próximos vencimentos"
        isLoading={loadingUpcoming}
        error={upcomingError ? 'Erro ao carregar eventos' : null}
        variant={variant}
        badge={totalEvents > 0 ? {
          label: totalEvents.toString(),
          colorPalette: overdueCount > 0 ? 'error' : 'warning'
        } : undefined}
        actions={[
          {
            label: 'Expandir',
            onClick: () => setShowFullCalendar(true),
            variant: 'outline',
            size: 'sm',
            colorPalette: 'green',
            borderColor: 'green.500',
            color: 'green.500',
            _hover: {
              borderColor: 'green.600',
              color: 'green.600'
            }
          }
        ]}
        primaryAction={{
          label: 'Ver tudo',
          onClick: handleViewFullCalendar,
          size: 'sm',
          colorPalette: 'brand'
        }}
      >
        <VStack gap={3} align="stretch">
          {upcomingEvents.length === 0 ? (
            <Box
              p={4}
              textAlign="center"
              bg="var(--accent)"
              borderWidth="1px"
              borderColor="var(--border)"
              borderRadius="md"
            >
              <Text fontSize="sm" color="var(--muted-foreground)">
                Nenhum vencimento nos próximos 7 dias
              </Text>
            </Box>
          ) : (
            <>
              {/* Lista de eventos */}
              <VStack gap={2} align="stretch">
                {upcomingEvents.slice(0, variant === 'compact' ? 3 : 5).map((event) => {
                  const eventDate = new Date(event.date);
                  const isToday = format(eventDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const statusInfo = getStatusBadge(event.status);
                  const canPay = event.status === 'pending' || event.status === 'overdue';

                  return (
                    <Box
                      key={event.id}
                      p={3}
                      bg="var(--card)"
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="var(--border)"
                      _hover={{ bg: 'var(--accent)' }}
                    >
                      <VStack gap={2} align="stretch">
                        <HStack justify="space-between">
                          <VStack align="start" gap={0} flex="1">
                            <HStack>
                              <Text
                                fontSize="xs"
                                color={isToday ? 'var(--warning)' : 'var(--muted-foreground)'}
                                fontWeight={isToday ? 'bold' : 'normal'}
                              >
                                {format(eventDate, "d 'de' MMM", { locale: ptBR })}
                                {isToday && " (Hoje)"}
                              </Text>
                              <Badge
                                size="sm"
                                variant="solid"
                                colorPalette={statusInfo.colorPalette}
                                borderRadius="full"
                              >
                                {statusInfo.label}
                              </Badge>
                            </HStack>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                            >
                              {event.description}
                            </Text>
                          </VStack>

                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={event.type === 'income' ? 'success.default' : 'error.default'}
                          >
                            {event.type === 'income' ? '+' : '-'} {formatCurrency(event.amount)}
                          </Text>
                        </HStack>

                        {/* Botão Pagar */}
                        {canPay && (
                          <Button
                            size="sm"
                            colorPalette="success"
                            w="full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (event.transaction.id) {
                                markAsPaid(event.transaction.id);
                              }
                            }}
                          >
                            Pagar
                          </Button>
                        )}
                      </VStack>
                    </Box>
                  );
                })}
              </VStack>

              {/* Resumo */}
              {upcomingEvents.length > 0 && variant !== 'compact' && (
                <Box
                  p={3}
                  bg="var(--secondary)"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="var(--border)"
                >
                  <HStack justify="space-between" fontSize="xs">
                    <Text color="var(--muted-foreground)">
                      {overdueCount} vencidos • {pendingCount} pendentes
                    </Text>
                    <Text color="var(--muted-foreground)">
                      Total: {formatCurrency(
                        upcomingEvents.reduce((sum, event) => {
                          return sum + (event.type === 'income' ? event.amount : -event.amount);
                        }, 0)
                      )}
                    </Text>
                  </HStack>
                </Box>
              )}
            </>
          )}
        </VStack>
      </BaseWidget>

      {/* Popover de detalhes */}
      {selectedDate && (
        <CalendarPopover
          date={selectedDate}
          events={getDayEvents(selectedDate)}
          isOpen={Boolean(selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </>
  );
};