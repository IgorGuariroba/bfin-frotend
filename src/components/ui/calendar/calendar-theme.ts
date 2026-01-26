// src/components/ui/calendar/calendar-theme.ts

import type { CalendarEventColor } from '@/types/calendar'

/**
 * Tema customizado para o calendário integrado com Chakra UI v3
 */

// Mapeamento de cores para diferentes status de eventos
export const eventColors = {
  green: 'var(--success)',       // Pago
  yellow: 'var(--warning)',      // Vencendo
  red: 'var(--destructive)',     // Vencido
  blue: 'var(--info)',           // Agendado
  gray: 'var(--muted-foreground)', // Sem eventos
} as const

// Estilos base para o calendário
export const calendarStyles = {
  calendar: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: 'xl',
    border: '1px solid var(--border)',
    bg: 'var(--card)',
    boxShadow: 'var(--shadow-sm)',
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
      bg: 'var(--accent)',
    },

    _selected: {
      bg: 'var(--primary)',
      color: 'var(--primary-foreground)',
      _hover: {
        bg: 'var(--primary-600)',
      },
    },

    _today: {
      bg: 'var(--accent)',
      color: 'var(--primary)',
      fontWeight: 'bold',
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
export const getCalendarCSSVars = (size: 'sm' | 'md' | 'lg' = 'md', _colorMode: 'light' | 'dark' = 'light') => {
  const cellSize = size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px'

  return {
    '--rdp-cell-size': cellSize,
    '--rdp-accent-color': 'var(--primary)',
    '--rdp-background-color': 'var(--card)',
    '--rdp-outline-color': 'var(--ring)',
    '--rdp-outline-selected-color': 'var(--primary-600)',
    '--rdp-selected-color': 'var(--primary-foreground)',
    '--rdp-disabled-opacity': '0.4',
    '--rdp-text-color': 'var(--foreground)',
    '--rdp-text-color-disabled': 'var(--muted-foreground)',
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
