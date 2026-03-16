import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Skeleton,
} from '@chakra-ui/react'
import { Calendar as CalendarIcon, ChevronRight, Eye } from 'lucide-react'
import { format, addDays, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { Calendar } from '@/components/organisms/Calendar'
import { CalendarPopover } from '@/components/organisms/CalendarPopover'
import { useCalendar } from '@/hooks/useCalendar'
import { useQuery } from '@tanstack/react-query'
import { transactionService } from '@/services/transactionService'
import type { CalendarEvent } from '@/types/calendar'
import type { Transaction } from '@/types/transaction'

interface CalendarWidgetProps {
  onViewFullCalendar?: () => void
}

// Hook para buscar eventos dos próximos 7 dias
function useUpcomingEvents() {
  const today = startOfDay(new Date())
  const next7Days = endOfDay(addDays(new Date(), 7))

  return useQuery({
    queryKey: ['upcoming-events', format(today, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await transactionService.list({
        startDate: today.toISOString(),
        endDate: next7Days.toISOString(),
      })

      return transformTransactionsToEvents(response.transactions)
    },
    staleTime: 1000 * 60 * 2, // 2 minutos - atualiza frequentemente
    refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
  })
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
    }))
}

function getTransactionStatus(transaction: Transaction): 'pending' | 'paid' | 'overdue' {
  if (transaction.status === 'executed' || transaction.executed_date) return 'paid'
  if (transaction.status === 'cancelled') return 'pending'

  if (!transaction.due_date) return 'pending'
  if (new Date(transaction.due_date) < new Date()) return 'overdue'
  return 'pending'
}

function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = due.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getEventColor(transaction: Transaction): CalendarEvent['displayColor'] {
  const status = getTransactionStatus(transaction)
  if (!transaction.due_date) return 'blue'
  const daysUntil = getDaysUntilDue(transaction.due_date)

  if (status === 'paid') return 'green'
  if (status === 'overdue') return 'red'
  if (status === 'pending' && daysUntil <= 3) return 'yellow'
  return 'blue'
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  onViewFullCalendar
}) => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showFullCalendar, setShowFullCalendar] = useState(false)

  // Hook do calendário para o mês atual (usado no expand mode)
  const calendar = useCalendar(new Date(), {})

  // Hook específico para próximos eventos - ATUALIZA AUTOMATICAMENTE
  const {
    data: upcomingEvents = [],
    isLoading: loadingUpcoming,
    error: upcomingError,
  } = useUpcomingEvents()

  const {
    getDayEvents,
    markAsPaid,
  } = calendar

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const getStatusBadge = (status: CalendarEvent['status']) => {
    const statusMap = {
      paid: { label: 'Pago', bg: 'var(--success)', color: 'var(--success-foreground)' },
      pending: { label: 'Pendente', bg: 'var(--warning)', color: 'var(--warning-foreground)' },
      overdue: { label: 'Vencido', bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
    }

    return statusMap[status]
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const secondaryButtonStyles = {
    bg: 'var(--secondary)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
    _hover: { bg: 'var(--accent)' },
    _active: { bg: 'var(--secondary)' },
    _focusVisible: { boxShadow: '0 0 0 2px var(--ring)' },
    _disabled: {
      bg: 'var(--accent)',
      color: 'var(--muted-foreground)',
      borderColor: 'var(--border)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
  }

  const primaryButtonStyles = {
    bg: 'var(--primary)',
    color: 'var(--primary-foreground)',
    boxShadow: 'var(--shadow-green-md)',
    _hover: { bg: 'var(--primary-600)' },
    _active: { bg: 'var(--primary-700)' },
    _focusVisible: { boxShadow: '0 0 0 2px var(--ring)' },
    _disabled: {
      bg: 'var(--accent)',
      color: 'var(--muted-foreground)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
  }

  const handleViewFullCalendar = () => {
    if (onViewFullCalendar) {
      onViewFullCalendar()
    } else {
      navigate('/calendar')
    }
  }

  if (showFullCalendar) {
    return (
      <Box
        bg="var(--card)"
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        boxShadow="var(--shadow-md)"
      >
        <VStack gap={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold" color="var(--foreground)">
              Calendário de Contas
            </Text>
            <Button
              size={{ base: 'sm', md: 'md' }}
              onClick={() => setShowFullCalendar(false)}
              {...secondaryButtonStyles}
            >
              Compacto
            </Button>
          </HStack>

          <Calendar
            compact={true}
            showFilters={false}
            onDateSelect={handleDateSelect}
            height="400px"
          />
        </VStack>
      </Box>
    )
  }

  return (
    <>
      <Box
        bg="var(--card)"
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        boxShadow="var(--shadow-md)"
      >
        <VStack gap={4} align="stretch">
          {/* Header */}
          <VStack align="stretch" gap={{ base: 3, md: 0 }}>
            <HStack justify="space-between" align="center" w="full">
              <HStack>
                <CalendarIcon size={20} color="var(--muted-foreground)" />
                <Text color="var(--muted-foreground)" fontWeight="medium">
                  Calendário
                </Text>
              </HStack>
            </HStack>
            <HStack
              justify={{ base: 'flex-start', md: 'flex-end' }}
              flexWrap="wrap"
              gap={2}
            >
              <Button
                size={{ base: 'sm', md: 'md' }}
                onClick={() => setShowFullCalendar(true)}
                {...secondaryButtonStyles}
              >
                <Eye size={14} style={{ marginRight: '8px' }} />
                Expandir
              </Button>
              <Button
                size={{ base: 'sm', md: 'md' }}
                onClick={handleViewFullCalendar}
                {...primaryButtonStyles}
              >
                VER TUDO
                <ChevronRight size={14} style={{ marginLeft: '8px' }} />
              </Button>
            </HStack>
          </VStack>

          {/* Loading ou Error */}
          {loadingUpcoming && (
            <VStack gap={2}>
              <Skeleton height="20px" borderRadius="md" />
              <Skeleton height="20px" borderRadius="md" />
              <Skeleton height="20px" borderRadius="md" />
            </VStack>
          )}

          {upcomingError && (
            <Text color="var(--destructive)" fontSize="sm" textAlign="center">
              Erro ao carregar eventos
            </Text>
          )}

          {/* Próximos Eventos */}
          {!loadingUpcoming && !upcomingError && (
            <VStack gap={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium" color="var(--muted-foreground)">
                Próximos vencimentos
              </Text>

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
                <VStack gap={2} align="stretch">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.date)
                    const isToday = format(eventDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    const statusInfo = getStatusBadge(event.status)
                    const canPay = event.status === 'pending' || event.status === 'overdue'

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
                                  bg={statusInfo.bg}
                                  color={statusInfo.color}
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
                              color={event.type === 'income' ? 'var(--success)' : 'var(--destructive)'}
                            >
                              {event.type === 'income' ? '+' : '-'} {formatCurrency(event.amount)}
                            </Text>
                          </HStack>
                          
                          {/* Botão Pagar - aparece apenas para despesas pendentes/vencidas */}
                          {canPay && (
                            <Button
                              size="sm"
                              colorPalette="green"
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
                    )
                  })}
                </VStack>
              )}

              {/* Resumo rápido */}
              {upcomingEvents.length > 0 && (
                <Box
                  p={3}
                  bg="var(--secondary)"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="var(--border)"
                >
                  <HStack justify="space-between" fontSize="xs">
                    <Text color="var(--muted-foreground)">
                      {upcomingEvents.filter(e => e.status === 'overdue').length} vencidos •{' '}
                      {upcomingEvents.filter(e => e.status === 'pending').length} pendentes
                    </Text>
                    <Text color="var(--muted-foreground)">
                      Total: {formatCurrency(
                        upcomingEvents.reduce((sum, event) => {
                          return sum + (event.type === 'income' ? event.amount : -event.amount)
                        }, 0)
                      )}
                    </Text>
                  </HStack>
                </Box>
              )}
            </VStack>
          )}
        </VStack>
      </Box>

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
  )
}
