// src/types/calendar.ts

import type { Transaction } from '@igorguariroba/bfin-sdk'

export interface CalendarEvent {
  id: string
  date: string // ISO format: '2026-01-15'
  transaction: Transaction
  type: 'income' | 'fixed_expense' | 'variable_expense'
  amount: number
  description: string
  category: string
  status: 'pending' | 'paid' | 'overdue'
  isRecurring: boolean
  daysUntilDue: number
  displayColor: CalendarEventColor
}

export type CalendarEventColor =
  | 'green'    // Pago
  | 'yellow'   // Vencendo (≤3 dias)
  | 'red'      // Vencido
  | 'blue'     // Agendado futuro
  | 'gray'     // Sem status

export interface CalendarFilters {
  types?: Array<'income' | 'fixed_expense' | 'variable_expense'>
  categories?: string[]
  statuses?: Array<'pending' | 'paid' | 'overdue'>
  accountId?: string
}

export interface CalendarDay {
  date: Date
  events: CalendarEvent[]
  hasEvents: boolean
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
}

export interface UseCalendarReturn {
  // Estado
  currentDate: Date
  selectedDate: Date | null
  events: CalendarEvent[]
  eventsByDate: Record<string, CalendarEvent[]>
  filters: CalendarFilters

  // Carregamento
  isLoading: boolean
  error: Error | null

  // Ações
  setCurrentDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
  setFilters: (filters: CalendarFilters) => void
  goToNextMonth: () => void
  goToPrevMonth: () => void
  goToToday: () => void
  refetch: () => void

  // Utilities
  getDayEvents: (date: Date) => CalendarEvent[]
  getDayStatus: (date: Date) => CalendarEventColor
  hasEventsOnDay: (date: Date) => boolean
}

export interface CalendarComponentProps {
  initialDate?: Date
  initialFilters?: CalendarFilters
  onDateSelect?: (date: Date, events: CalendarEvent[]) => void
  onEventClick?: (event: CalendarEvent) => void
  compact?: boolean
  showFilters?: boolean
  height?: string | number
}