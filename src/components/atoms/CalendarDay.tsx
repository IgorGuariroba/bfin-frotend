// src/components/atoms/CalendarDay.tsx

import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { format } from 'date-fns'
import type { CalendarEvent } from '@/types/calendar'
import { EventDot } from './EventDot'
import {
  getDominantEventColor,
  isDateToday,
  isDateInCurrentMonth,
  getDateAriaLabel,
  getDayId
} from '@/components/ui/calendar/calendar-utils'

interface CalendarDayProps {
  date: Date
  events: CalendarEvent[]
  isSelected: boolean
  currentMonthDate: Date
  onClick: (date: Date) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>, date: Date) => void
  size?: 'sm' | 'md' | 'lg'
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  events,
  isSelected,
  currentMonthDate,
  onClick,
  onKeyDown,
  size = 'md',
}) => {
  const dayNumber = format(date, 'd')
  const hasEvents = events.length > 0
  const isToday = isDateToday(date)
  const isCurrentMonth = isDateInCurrentMonth(date, currentMonthDate)

  // Determinar cor dominante dos eventos
  const dominantColor = getDominantEventColor(events)

  const sizeProps = {
    sm: { w: '32px', h: '32px', fontSize: 'xs' },
    md: { w: '40px', h: '40px', fontSize: 'sm' },
    lg: { w: '48px', h: '48px', fontSize: 'md' },
  }[size]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isCurrentMonth) {
        onClick(date)
      }
    }

    if (onKeyDown) {
      onKeyDown(e, date)
    }
  }

  return (
    <Box
      {...sizeProps}
      borderRadius="sm"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      cursor={isCurrentMonth ? 'pointer' : 'not-allowed'}
      onClick={() => isCurrentMonth && onClick(date)}
      onKeyDown={handleKeyDown}
      bg={
        isSelected
          ? 'orange.500'
          : isToday
            ? 'orange.50'
            : 'transparent'
      }
      color={
        isSelected
          ? 'white'
          : isToday
            ? 'orange.900'
            : isCurrentMonth
              ? 'fg.default'
              : 'fg.muted'
      }
      fontWeight={isToday ? 'bold' : 'medium'}
      opacity={isCurrentMonth ? 1 : 0.4}
      transition="all 0.2s"
      _hover={isCurrentMonth ? {
        bg: isSelected ? 'orange.600' : 'gray.100',
        transform: hasEvents ? 'scale(1.05)' : 'none',
      } : {}}
      _dark={{
        bg: isSelected ? 'orange.500' : isToday ? 'orange.900' : 'transparent',
        color: isSelected
          ? 'white'
          : isToday
            ? 'orange.100'
            : isCurrentMonth
              ? 'fg.default'
              : 'fg.muted',
        _hover: isCurrentMonth ? {
          bg: isSelected ? 'orange.600' : 'gray.700',
        } : {},
      }}
      aria-label={getDateAriaLabel(date, events)}
      role="gridcell"
      tabIndex={isCurrentMonth ? 0 : -1}
      data-testid={`calendar-day-${getDayId(date)}`}
      data-selected={isSelected}
      data-today={isToday}
      data-current-month={isCurrentMonth}
      data-has-events={hasEvents}
      aria-selected={isSelected}
      aria-current={isToday ? 'date' : undefined}
    >
      <Text>{dayNumber}</Text>

      {hasEvents && (
        <>
          <EventDot
            color={dominantColor}
            count={events.length}
            size={size}
          />

          {/* Informações para screen readers */}
          <Box
            position="absolute"
            left="-9999px"
            aria-hidden="true"
            id={`events-${getDayId(date)}`}
          >
            {events.map(event => (
              <span key={event.id}>
                {event.description}, R$ {event.amount.toFixed(2)}, {
                  event.status === 'paid' ? 'Pago' :
                  event.status === 'pending' ? 'Pendente' :
                  'Vencido'
                }
              </span>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}