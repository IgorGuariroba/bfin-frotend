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
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { Calendar } from '@/components/organisms/Calendar'
import { CalendarPopover } from '@/components/organisms/CalendarPopover'
import { useCalendar } from '@/hooks/useCalendar'
import type { CalendarEvent } from '@/types/calendar'

interface CalendarWidgetProps {
  onViewFullCalendar?: () => void
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  onViewFullCalendar
}) => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showFullCalendar, setShowFullCalendar] = useState(false)

  const handleViewFullCalendar = () => {
    if (onViewFullCalendar) {
      onViewFullCalendar()
    } else {
      navigate('/calendar')
    }
  }

  const calendar = useCalendar(new Date(), {})

  const {
    isLoading,
    error,
    getDayEvents,
  } = calendar

  // Obter eventos dos próximos 7 dias
  const getUpcomingEvents = () => {
    const startDate = new Date()
    const endDate = addDays(new Date(), 7)
    const upcomingEvents: CalendarEvent[] = []

    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const dayEvents = getDayEvents(date)
      upcomingEvents.push(...dayEvents.map(event => ({ ...event, date: format(date, 'yyyy-MM-dd') })))
    }

    return upcomingEvents
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5) // Mostrar apenas os 5 próximos
  }

  const upcomingEvents = getUpcomingEvents()

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const getStatusBadge = (status: CalendarEvent['status']) => {
    const statusMap = {
      paid: { label: 'Pago', colorPalette: 'green' as const },
      pending: { label: 'Pendente', colorPalette: 'yellow' as const },
      overdue: { label: 'Vencido', colorPalette: 'red' as const },
    }

    return statusMap[status]
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (showFullCalendar) {
    return (
      <Box
        bg="var(--card)"
        borderRadius="xl"
        p={6}
        shadow="md"
      >
        <VStack gap={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">
              Calendário de Contas
            </Text>
            <Button
              size="md"
              variant="outline"
              onClick={() => setShowFullCalendar(false)}
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
        p={6}
        shadow="md"
      >
        <VStack gap={4} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <HStack>
              <CalendarIcon size={20} color="var(--muted-foreground)" />
              <Text color="var(--muted-foreground)" fontWeight="medium">
                Calendário
              </Text>
            </HStack>
            <HStack>
              <Button
                size="md"
                variant="outline"
                onClick={() => setShowFullCalendar(true)}
              >
                <Eye size={14} style={{ marginRight: '8px' }} />
                Expandir
              </Button>
              <Button
                size="md"
                bg="var(--primary)"
                color="var(--primary-foreground)"
                _hover={{ opacity: 0.9 }}
                onClick={handleViewFullCalendar}
              >
                VER TUDO
                <ChevronRight size={14} style={{ marginLeft: '8px' }} />
              </Button>
            </HStack>
          </HStack>

          {/* Loading ou Error */}
          {isLoading && (
            <VStack gap={2}>
              <Skeleton height="20px" borderRadius="md" />
              <Skeleton height="20px" borderRadius="md" />
              <Skeleton height="20px" borderRadius="md" />
            </VStack>
          )}

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              Erro ao carregar eventos
            </Text>
          )}

          {/* Próximos Eventos */}
          {!isLoading && !error && (
            <VStack gap={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium" color="var(--muted-foreground)">
                Próximos vencimentos
              </Text>

              {upcomingEvents.length === 0 ? (
                <Box
                  p={4}
                  textAlign="center"
                  bg="var(--muted)"
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

                    return (
                      <HStack
                        key={event.id}
                        p={3}
                        bg="var(--card)"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="var(--border)"
                        justify="space-between"
                        _hover={{ bg: 'var(--muted)' }}
                      >
                        <VStack align="start" gap={0} flex="1">
                          <HStack>
                            <Text
                              fontSize="xs"
                              color={isToday ? "orange.500" : "var(--muted-foreground)"}
                              fontWeight={isToday ? "bold" : "normal"}
                            >
                              {format(eventDate, "d 'de' MMM", { locale: ptBR })}
                              {isToday && " (Hoje)"}
                            </Text>
                            <Badge
                              size="sm"
                              colorPalette={statusInfo.colorPalette}
                              variant="outline"
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
                          color={event.type === 'income' ? 'green.500' : 'red.500'}
                        >
                          {event.type === 'income' ? '+' : '-'} {formatCurrency(event.amount)}
                        </Text>
                      </HStack>
                    )
                  })}
                </VStack>
              )}

              {/* Resumo rápido */}
              {upcomingEvents.length > 0 && (
                <Box
                  p={3}
                  bg="var(--muted)"
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