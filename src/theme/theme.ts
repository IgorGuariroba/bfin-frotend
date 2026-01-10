/**
 * BFIN Design System Theme
 *
 * ARQUITETURA:
 * - Todas as cores são definidas em index.css como variáveis CSS
 * - Este tema mapeia as variáveis CSS para o Chakra UI v3
 * - Mudanças de cor devem ser feitas APENAS em index.css
 *
 * Primary: Emerald Green (#10B981)
 */

import { createSystem, defaultConfig } from '@chakra-ui/react';

/**
 * Chakra UI v3 System Configuration
 *
 * Usa createSystem com defaultConfig como base e estende com tokens personalizados
 * e estilos globais.
 */
export const system = createSystem(defaultConfig, {
  theme: {
    // Breakpoints (Media Queries)
    // Mobile-first approach: base é o padrão, outros são min-width
    breakpoints: {
      base: '0em',    // 0px - Mobile (padrão)
      sm: '30em',     // 480px - Small devices
      md: '48em',     // 768px - Tablets
      lg: '62em',     // 992px - Desktop
      xl: '80em',     // 1280px - Large desktop
      '2xl': '96em',  // 1536px - Extra large desktop
    },

    tokens: {
      // Fonts
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
        mono: { value: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace` },
      },

      // Font Sizes
      fontSizes: {
        xs: { value: '0.75rem' },    // 12px
        sm: { value: '0.875rem' },   // 14px
        md: { value: '1rem' },       // 16px
        lg: { value: '1.125rem' },  // 18px
        xl: { value: '1.25rem' },   // 20px
        '2xl': { value: '1.5rem' }, // 24px
        '3xl': { value: '1.875rem' }, // 30px
        '4xl': { value: '2.25rem' },  // 36px
        '5xl': { value: '3rem' },     // 48px
      },

      // Font Weights
      fontWeights: {
        normal: { value: '400' },
        medium: { value: '500' },
        semibold: { value: '600' },
        bold: { value: '700' },
      },

      // Line Heights
      lineHeights: {
        none: { value: '1' },
        tight: { value: '1.25' },
        snug: { value: '1.375' },
        normal: { value: '1.5' },
        relaxed: { value: '1.625' },
        loose: { value: '2' },
      },

      // Spacing (baseado em 4px)
      spacing: {
        0: { value: '0' },
        1: { value: '0.25rem' },   // 4px
        2: { value: '0.5rem' },    // 8px
        3: { value: '0.75rem' },   // 12px
        4: { value: '1rem' },      // 16px
        5: { value: '1.25rem' },   // 20px
        6: { value: '1.5rem' },    // 24px
        8: { value: '2rem' },      // 32px
        10: { value: '2.5rem' },   // 40px
        12: { value: '3rem' },     // 48px
        16: { value: '4rem' },     // 64px
        20: { value: '5rem' },     // 80px
        24: { value: '6rem' },     // 96px
      },

      // Border Radius
      radii: {
        none: { value: '0' },
        sm: { value: '0.125rem' },  // 2px
        md: { value: '0.375rem' },  // 6px
        lg: { value: '0.5rem' },    // 8px
        xl: { value: '0.75rem' },   // 12px
        '2xl': { value: '1rem' },   // 16px
        '3xl': { value: '1.5rem' }, // 24px
        full: { value: '9999px' },
      },

      // Shadows
      shadows: {
        xs: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
        sm: { value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
        md: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
        lg: { value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
        xl: { value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
      },

      // Colors - Design Tokens
      colors: {
        // Brand (Emerald Green) - Primary palette
        'brand.50': { value: 'var(--primary-50)' },
        'brand.100': { value: 'var(--primary-100)' },
        'brand.200': { value: 'var(--primary-200)' },
        'brand.300': { value: 'var(--primary-300)' },
        'brand.400': { value: 'var(--primary-400)' },
        'brand.500': { value: 'var(--primary-500)' },
        'brand.600': { value: 'var(--primary-600)' },
        'brand.700': { value: 'var(--primary-700)' },
        'brand.800': { value: 'var(--primary-800)' },
        'brand.900': { value: 'var(--primary-900)' },
        'brand.950': { value: 'var(--primary-950)' },

        // Gray - Pure neutral
        'gray.50': { value: 'var(--gray-50)' },
        'gray.100': { value: 'var(--gray-100)' },
        'gray.200': { value: 'var(--gray-200)' },
        'gray.300': { value: 'var(--gray-300)' },
        'gray.400': { value: 'var(--gray-400)' },
        'gray.500': { value: 'var(--gray-500)' },
        'gray.600': { value: 'var(--gray-600)' },
        'gray.700': { value: 'var(--gray-700)' },
        'gray.800': { value: 'var(--gray-800)' },
        'gray.900': { value: 'var(--gray-900)' },
        'gray.950': { value: 'var(--gray-950)' },

        // Green (Teal) - Success palette
        'green.50': { value: 'var(--green-50)' },
        'green.100': { value: 'var(--green-100)' },
        'green.200': { value: 'var(--green-200)' },
        'green.300': { value: 'var(--green-300)' },
        'green.400': { value: 'var(--green-400)' },
        'green.500': { value: 'var(--green-500)' },
        'green.600': { value: 'var(--green-600)' },
        'green.700': { value: 'var(--green-700)' },
        'green.800': { value: 'var(--green-800)' },
        'green.900': { value: 'var(--green-900)' },

        // Blue (Indigo) - Info palette
        'blue.50': { value: 'var(--blue-50)' },
        'blue.100': { value: 'var(--blue-100)' },
        'blue.200': { value: 'var(--blue-200)' },
        'blue.300': { value: 'var(--blue-300)' },
        'blue.400': { value: 'var(--blue-400)' },
        'blue.500': { value: 'var(--blue-500)' },
        'blue.600': { value: 'var(--blue-600)' },
        'blue.700': { value: 'var(--blue-700)' },
        'blue.800': { value: 'var(--blue-800)' },
        'blue.900': { value: 'var(--blue-900)' },

        // Yellow (Amber) - Warning palette
        'yellow.50': { value: 'var(--yellow-50)' },
        'yellow.100': { value: 'var(--yellow-100)' },
        'yellow.200': { value: 'var(--yellow-200)' },
        'yellow.300': { value: 'var(--yellow-300)' },
        'yellow.400': { value: 'var(--yellow-400)' },
        'yellow.500': { value: 'var(--yellow-500)' },
        'yellow.600': { value: 'var(--yellow-600)' },
        'yellow.700': { value: 'var(--yellow-700)' },
        'yellow.800': { value: 'var(--yellow-800)' },
        'yellow.900': { value: 'var(--yellow-900)' },

        // Red (Magenta) - Error/Destructive palette
        'red.50': { value: 'var(--red-50)' },
        'red.100': { value: 'var(--red-100)' },
        'red.200': { value: 'var(--red-200)' },
        'red.300': { value: 'var(--red-300)' },
        'red.400': { value: 'var(--red-400)' },
        'red.500': { value: 'var(--red-500)' },
        'red.600': { value: 'var(--red-600)' },
        'red.700': { value: 'var(--red-700)' },
        'red.800': { value: 'var(--red-800)' },
        'red.900': { value: 'var(--red-900)' },

        // Semantic colors
        'bg': { value: 'var(--background)' },
        'fg': { value: 'var(--foreground)' },
        'card': { value: 'var(--card)' },
        'card.fg': { value: 'var(--card-foreground)' },
        'border': { value: 'var(--border)' },
        'muted': { value: 'var(--muted)' },
        'muted.fg': { value: 'var(--muted-foreground)' },
        'primary': { value: 'var(--primary)' },
        'primary.fg': { value: 'var(--primary-foreground)' },
        'secondary': { value: 'var(--secondary)' },
        'secondary.fg': { value: 'var(--secondary-foreground)' },
        'accent': { value: 'var(--accent)' },
        'accent.fg': { value: 'var(--accent-foreground)' },
        'success': { value: 'var(--success)' },
        'success.fg': { value: 'var(--success-foreground)' },
        'warning': { value: 'var(--warning)' },
        'warning.fg': { value: 'var(--warning-foreground)' },
        'error': { value: 'var(--destructive)' },
        'error.fg': { value: 'var(--destructive-foreground)' },
        'info': { value: 'var(--info)' },
        'info.fg': { value: 'var(--info-foreground)' },
      },
    },

    // Semantic tokens (valores que dependem de outros tokens)
    semanticTokens: {
      colors: {
        // Mapear semantic tokens para facilitar uso
        'bg': { value: { base: '{colors.bg}', _dark: '{colors.bg}' } },
        'fg': { value: { base: '{colors.fg}', _dark: '{colors.fg}' } },
      },
    },
  },

  // Global CSS
  globalCss: {
    'html, body': {
      bg: 'var(--background)',
      color: 'var(--foreground)',
      fontFamily: 'body',
    },
    '*::selection': {
      bg: 'var(--primary)',
      color: 'var(--primary-foreground)',
    },
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'var(--muted)',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'var(--border)',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      bg: 'var(--muted-foreground)',
    },
  },
});
