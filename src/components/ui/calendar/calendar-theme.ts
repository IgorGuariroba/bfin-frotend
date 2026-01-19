// src/components/ui/calendar/calendar-theme.ts

import type { CalendarEventColor } from '@/types/calendar'

/**
 * Tema customizado para o calendário integrado com Chakra UI v3
 */

// Mapeamento de cores para diferentes status de eventos
export const eventColors = {
  green: 'green.500',    // Pago
  yellow: 'yellow.500',  // Vencendo
  red: 'red.500',        // Vencido
  blue: 'blue.500',      // Agendado
  gray: 'gray.300',      // Sem eventos
} as const

// Estilos base para o calendário
export const calendarStyles = {
  calendar: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'border',
    bg: 'bg',
    p: 4,
  },

  calendarCompact: {
    maxWidth: '300px',
    p: 2,
  },

  day: {
    width: '40px',
    height: '40px',
    borderRadius: 'sm',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    fontSize: 'sm',
    fontWeight: 'medium',
    transition: 'all 0.2s',

    _hover: {
      bg: 'gray.100',
      _dark: { bg: 'gray.700' },
    },

    _selected: {
      bg: 'brand.500',
      color: 'white',
      _hover: {
        bg: 'brand.600',
      },
    },

    _today: {
      bg: 'brand.50',
      color: 'brand.900',
      fontWeight: 'bold',
      _dark: {
        bg: 'brand.900',
        color: 'brand.100',
      },
    },

    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
      _hover: {
        bg: 'transparent',
      },
    },
  },

  dayCompact: {
    width: '32px',
    height: '32px',
    fontSize: 'xs',
  },

  dayLarge: {
    width: '48px',
    height: '48px',
    fontSize: 'md',
  },

  event: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '6px',
    height: '6px',
    borderRadius: 'full',
  },
}

// CSS variables para integração com React Day Picker
export const getCalendarCSSVars = (size: 'sm' | 'md' | 'lg' = 'md', colorMode: 'light' | 'dark' = 'light') => {
  const cellSize = size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px'

  if (colorMode === 'dark') {
    return {
      '--rdp-cell-size': cellSize,
      '--rdp-accent-color': 'var(--brand-400)',
      '--rdp-background-color': 'var(--bg)',
      '--rdp-outline-color': 'var(--brand-600)',
      '--rdp-outline-selected-color': 'var(--brand-300)',
      '--rdp-selected-color': 'white',
      '--rdp-disabled-opacity': '0.4',
      '--rdp-text-color': 'var(--fg)',
      '--rdp-text-color-disabled': 'var(--muted-fg)',
    }
  }

  return {
    '--rdp-cell-size': cellSize,
    '--rdp-accent-color': 'var(--brand-500)',
    '--rdp-background-color': 'var(--bg)',
    '--rdp-outline-color': 'var(--brand-300)',
    '--rdp-outline-selected-color': 'var(--brand-600)',
    '--rdp-selected-color': 'white',
    '--rdp-disabled-opacity': '0.4',
    '--rdp-text-color': 'var(--fg)',
    '--rdp-text-color-disabled': 'var(--muted-fg)',
  }
}

// Função para obter cor do evento baseado no status
export const getEventColorValue = (color: CalendarEventColor): string => {
  return eventColors[color]
}

// Estilos responsivos
export const responsiveStyles = {
  base: { // Mobile
    calendar: { maxW: '100%', p: 2 },
    day: { w: '32px', h: '32px', fontSize: 'xs' },
    showFilters: false,
  },
  md: { // Tablet
    calendar: { maxW: '400px', p: 4 },
    day: { w: '40px', h: '40px', fontSize: 'sm' },
    showFilters: true,
  },
  lg: { // Desktop
    calendar: { maxW: '500px', p: 6 },
    day: { w: '48px', h: '48px', fontSize: 'md' },
    showFilters: true,
  },
}