// src/components/ui/calendar/index.tsx

import { forwardRef } from 'react'
import { DayPicker, DayPickerProps } from 'react-day-picker'
import { Box } from '@chakra-ui/react'
import { useColorMode } from '../useColorMode'
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
    const { colorMode } = useColorMode()

    // Determinar tamanho baseado na prop compact ou size
    const finalSize = compact ? 'sm' : size

    // CSS variables para integração com React Day Picker
    const cssVars = getCalendarCSSVars(finalSize, colorMode)

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
.chakra-calendar {
  display: flex;
  justify-content: center;
}

.chakra-calendar .rdp {
  --rdp-cell-size: var(--rdp-cell-size, 40px);
  --rdp-accent-color: var(--rdp-accent-color);
  --rdp-background-color: var(--rdp-background-color);
  --rdp-outline-color: var(--rdp-outline-color);
  margin: 0;
  width: 100%;
  max-width: min(100%, 500px);
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
  min-width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.chakra-calendar .rdp-head_row,
.chakra-calendar .rdp-row {
  height: auto;
  min-height: var(--rdp-cell-size);
  width: 100%;
}

.chakra-calendar .rdp-head_cell {
  padding: 0.5rem 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--rdp-text-color-disabled, #666);
  text-transform: uppercase;
  width: 14.28%; /* 100% / 7 dias */
  min-height: 2.5rem;
}

.chakra-calendar .rdp-cell {
  padding: 0;
  width: 14.28%; /* 100% / 7 dias */
  height: auto;
  min-height: var(--rdp-cell-size);
}

.chakra-calendar .rdp-button {
  width: 100%;
  height: 100%;
  min-height: var(--rdp-cell-size);
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
  margin: 2px;
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

/* Responsividade */
@media (min-width: 768px) {
  .chakra-calendar .rdp {
    max-width: 500px;
  }

  .chakra-calendar .rdp-cell {
    width: calc(100% / 7);
  }

  .chakra-calendar .rdp-head_cell {
    width: calc(100% / 7);
  }
}

@media (min-width: 1024px) {
  .chakra-calendar .rdp {
    max-width: 600px;
  }
}
`
