import { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { startOfMonth, endOfMonth, format, addMonths } from 'date-fns'
import type { CalendarEvent, CalendarFilters, UseCalendarReturn, CalendarEventColor } from '@/types/calendar'
import { transactionService } from '@/services/transactionService'
import type { Transaction } from '@/types/transaction'

export function useCalendar(
  initialDate = new Date(),
  initialFilters: CalendarFilters = {}
): UseCalendarReturn {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filters, setFilters] = useState<CalendarFilters>(initialFilters)

  // Query para eventos do mês atual
  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: [
      'calendar-events',
      format(currentDate, 'yyyy-MM'),
      filters
    ],
    queryFn: async () => {
      const startDate = startOfMonth(currentDate)
      const endDate = endOfMonth(currentDate)

      // CORREÇÃO: API espera formato date-time (ISO), não date
      // Documentação da API confirma: format: "date-time" para startDate e endDate
      const startDateISO = startDate.toISOString()  // "2026-01-01T03:00:00.000Z"
      const endDateISO = endDate.toISOString()      // "2026-01-31T03:00:00.000Z"

      try {
        const response = await transactionService.list({
          startDate: startDateISO,
          endDate: endDateISO,
          ...filters
        })

        return transformTransactionsToEvents(response.transactions, currentDate)
      } catch (error) {
        console.error('❌ [useCalendar] Erro na API:', error)

        // Log detalhado do erro
        if (error instanceof Error) {
          console.error('❌ Error message:', error.message)
          console.error('❌ Error stack:', error.stack)
        }

        // Se for um erro axios, log dos detalhes da resposta
        if (error && typeof error === 'object' && 'response' in error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const axiosError = error as any
          console.error('❌ Status:', axiosError.response?.status)
          console.error('❌ Data:', axiosError.response?.data)
          console.error('❌ Headers:', axiosError.response?.headers)
          console.error('❌ Config:', axiosError.config)
        }

        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30,   // 30 minutos
  })

  // Agrupar eventos por data
  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      const dateKey = event.date
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(event)
      return acc
    }, {} as Record<string, CalendarEvent[]>)
  }, [events])

  // Ações de navegação
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1))
  }, [])

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, -1))
  }, [])

  const goToToday = useCallback(() => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }, [])

  // Utilities
  const getDayEvents = useCallback((date: Date): CalendarEvent[] => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return eventsByDate[dateKey] || []
  }, [eventsByDate])

  const hasEventsOnDay = useCallback((date: Date): boolean => {
    return getDayEvents(date).length > 0
  }, [getDayEvents])

  const getDayStatus = useCallback((date: Date): CalendarEventColor => {
    const events = getDayEvents(date)
    if (events.length === 0) return 'gray'

    // Prioridade: vencido > vencendo > pago > futuro
    if (events.some(e => e.status === 'overdue')) return 'red'
    if (events.some(e => e.status === 'pending' && e.daysUntilDue <= 3)) return 'yellow'
    if (events.some(e => e.status === 'paid')) return 'green'

    return 'blue' // Agendado
  }, [getDayEvents])

  return {
    // Estado
    currentDate,
    selectedDate,
    events,
    eventsByDate,
    filters,

    // Carregamento
    isLoading,
    error,

    // Ações
    setCurrentDate,
    setSelectedDate,
    setFilters,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    refetch,

    // Utilities
    getDayEvents,
    getDayStatus,
    hasEventsOnDay,
  }
}

// Função helper para transformar transações em eventos
function transformTransactionsToEvents(
  transactions: Transaction[],
  _currentDate: Date
): CalendarEvent[] {
  return transactions.map(transaction => ({
    id: transaction.id,
    date: format(new Date(transaction.due_date), 'yyyy-MM-dd'),
    transaction,
    type: transaction.type,
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
  if (transaction.status === 'cancelled') return 'pending' // ou tratar como 'paid' para não alertar?
  
  if (new Date(transaction.due_date) < new Date()) return 'overdue'
  return 'pending'
}

function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = due.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getEventColor(transaction: Transaction): CalendarEventColor {
  const status = getTransactionStatus(transaction)
  const daysUntil = getDaysUntilDue(transaction.due_date)

  if (status === 'paid') return 'green'
  if (status === 'overdue') return 'red'
  if (status === 'pending' && daysUntil <= 3) return 'yellow'
  return 'blue'
}
