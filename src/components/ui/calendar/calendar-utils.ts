// src/components/ui/calendar/calendar-utils.ts

import { format, isToday, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { CalendarEvent, CalendarEventColor } from '@/types/calendar'

/**
 * Utilitários para o calendário
 */

// Formatar data para exibição
export const formatDateForDisplay = (date: Date, formatString: string = 'dd/MM/yyyy'): string => {
  return format(date, formatString, { locale: ptBR })
}

// Formatar mês e ano para cabeçalho
export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: ptBR })
}

// Verificar se é hoje
export const isDateToday = (date: Date): boolean => {
  return isToday(date)
}

// Verificar se a data está no mês atual sendo exibido
export const isDateInCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth)
}

// Obter cor dominante dos eventos do dia
export const getDominantEventColor = (events: CalendarEvent[]): CalendarEventColor => {
  if (events.length === 0) return 'gray'

  // Prioridade: vencido > vencendo > pago > futuro
  if (events.some(e => e.status === 'overdue')) return 'red'
  if (events.some(e => e.status === 'pending' && e.daysUntilDue <= 3)) return 'yellow'
  if (events.some(e => e.status === 'paid')) return 'green'

  return 'blue'
}

// Gerar descrição para acessibilidade
export const getDateAriaLabel = (date: Date, events: CalendarEvent[]): string => {
  const dateStr = formatDateForDisplay(date)
  const eventCount = events.length

  if (eventCount === 0) {
    return `${dateStr} - Sem eventos`
  }

  const eventText = eventCount === 1 ? 'evento' : 'eventos'
  return `${dateStr} - ${eventCount} ${eventText}`
}

// Gerar ID único para o dia
export const getDayId = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

// Verificar se duas datas são iguais (apenas dia/mês/ano)
export const isSameDate = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false
  return getDayId(date1) === getDayId(date2)
}

// Obter status do dia baseado nos eventos
export const getDayStatusFromEvents = (events: CalendarEvent[]): {
  hasEvents: boolean
  status: CalendarEventColor
  priority: number // 0 = menor prioridade, 4 = maior prioridade
} => {
  if (events.length === 0) {
    return { hasEvents: false, status: 'gray', priority: 0 }
  }

  // Determinar status por prioridade
  if (events.some(e => e.status === 'overdue')) {
    return { hasEvents: true, status: 'red', priority: 4 }
  }

  if (events.some(e => e.status === 'pending' && e.daysUntilDue <= 3)) {
    return { hasEvents: true, status: 'yellow', priority: 3 }
  }

  if (events.some(e => e.status === 'paid')) {
    return { hasEvents: true, status: 'green', priority: 2 }
  }

  return { hasEvents: true, status: 'blue', priority: 1 }
}

// Filtrar eventos visíveis
export const getVisibleEvents = (
  events: CalendarEvent[],
  maxVisible: number = 3
): {
  visibleEvents: CalendarEvent[]
  hiddenCount: number
} => {
  if (events.length <= maxVisible) {
    return {
      visibleEvents: events,
      hiddenCount: 0
    }
  }

  return {
    visibleEvents: events.slice(0, maxVisible),
    hiddenCount: events.length - maxVisible
  }
}

// Agrupar eventos por status
export const groupEventsByStatus = (events: CalendarEvent[]): Record<CalendarEvent['status'], CalendarEvent[]> => {
  return events.reduce((acc, event) => {
    if (!acc[event.status]) {
      acc[event.status] = []
    }
    acc[event.status].push(event)
    return acc
  }, {} as Record<CalendarEvent['status'], CalendarEvent[]>)
}

// Calcular estatísticas dos eventos do dia
export const getEventStatistics = (events: CalendarEvent[]) => {
  const total = events.length
  const paid = events.filter(e => e.status === 'paid').length
  const pending = events.filter(e => e.status === 'pending').length
  const overdue = events.filter(e => e.status === 'overdue').length

  const totalAmount = events.reduce((sum, event) => {
    if (event.type === 'income') return sum + event.amount
    return sum - event.amount
  }, 0)

  return {
    total,
    paid,
    pending,
    overdue,
    totalAmount,
    hasIncome: events.some(e => e.type === 'income'),
    hasExpenses: events.some(e => e.type === 'fixed_expense' || e.type === 'variable_expense'),
  }
}