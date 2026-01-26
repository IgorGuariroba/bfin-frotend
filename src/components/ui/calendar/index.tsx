// src/components/ui/calendar/index.tsx

import { forwardRef } from 'react'
import { DayPicker, DayPickerProps } from 'react-day-picker'
import { Box } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { ptBR } from 'date-fns/locale'
import type { CalendarComponentProps } from '@/types/calendar'
import { calendarStyles, getCalendarCSSVars } from './calendar-theme'

export interface ChakraCalendarProps extends
  Omit<DayPickerProps, 'locale'>,
  CalendarComponentProps {
  variant?: 'default' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  onSelect?: (date: Date | undefined) => void
  opacity?: number | string
}

export const ChakraCalendar = forwardRef<HTMLDivElement, ChakraCalendarProps>(
  ({ variant = 'default', size = 'md', className, compact, opacity, ...props }, ref) => {
    const { resolvedTheme } = useTheme()

    // Determinar tamanho baseado na prop compact ou size
    const finalSize = compact ? 'sm' : size

    // CSS variables para integração com React Day Picker
    const cssVars = getCalendarCSSVars(finalSize, resolvedTheme as 'light' | 'dark')

    // Estilos do calendário baseado na variante
    const calendarStyle = {
      ...calendarStyles.calendar,
      ...(variant === 'compact' || compact ? calendarStyles.calendarCompact : {}),
      opacity,
    }

    return (
      <Box
        ref={ref}
        {...calendarStyle}
        style={cssVars as React.CSSProperties}
        className={`chakra-calendar ${className || ''}`}
        data-testid="calendar-grid"
      >
        <DayPicker
          locale={ptBR}
          weekStartsOn={0} // Domingo
          fixedWeeks
          showOutsideDays
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(props as any)}
        />
      </Box>
    )
  }
)

ChakraCalendar.displayName = 'ChakraCalendar'

// CSS personalizado para React Day Picker integrado com Chakra UI
export const calendarCSS = `
.chakra-calendar .rdp {
  --rdp-cell-size: var(--rdp-cell-size, 40px);
  --rdp-accent-color: var(--rdp-accent-color);
  --rdp-background-color: var(--rdp-background-color);
  --rdp-outline-color: var(--rdp-outline-color);
  margin: 0;
}

.chakra-calendar .rdp-months {
  display: flex;
}

.chakra-calendar .rdp-month {
  margin: 0;
}

.chakra-calendar .rdp-table {
  width: 100%;
  max-width: none;
  border-collapse: collapse;
}

.chakra-calendar .rdp-head_row,
.chakra-calendar .rdp-row {
  height: auto;
}

.chakra-calendar .rdp-head_cell {
  padding: 0.5rem 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--rdp-text-color-disabled, #666);
  text-transform: uppercase;
}

.chakra-calendar .rdp-cell {
  padding: 0;
}

.chakra-calendar .rdp-button {
  width: var(--rdp-cell-size);
  height: var(--rdp-cell-size);
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--rdp-text-color);
  transition: all 0.2s;
  position: relative;
}

.chakra-calendar .rdp-button:hover:not(.rdp-day_disabled) {
  background-color: var(--accent);
}

.chakra-calendar .rdp-day_today .rdp-button {
  background-color: var(--rdp-accent-color);
  color: var(--rdp-selected-color);
  font-weight: 700;
}

.chakra-calendar .rdp-day_selected .rdp-button {
  background-color: var(--rdp-accent-color);
  color: var(--rdp-selected-color);
}

.chakra-calendar .rdp-day_selected .rdp-button:hover {
  background-color: var(--rdp-outline-selected-color);
}

.chakra-calendar .rdp-day_outside {
  opacity: var(--rdp-disabled-opacity, 0.4);
}

.chakra-calendar .rdp-day_disabled .rdp-button {
  opacity: var(--rdp-disabled-opacity, 0.4);
  cursor: not-allowed;
}

.chakra-calendar .rdp-day_disabled .rdp-button:hover {
  background: none;
}

/* Navegação */
.chakra-calendar .rdp-nav {
  display: none; /* Será controlada pelo CalendarHeader */
}

.chakra-calendar .rdp-caption {
  display: none; /* Será controlada pelo CalendarHeader */
}
`
