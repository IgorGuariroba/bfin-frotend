/**
 * BFIN Design System Theme
 *
 * ARQUITETURA:
 * - TODOS os Design Tokens são definidos em index.css como variáveis CSS
 * - Este tema mapeia as variáveis CSS para o Chakra UI v3
 * - Mudanças devem ser feitas APENAS em index.css (single source of truth)
 *
 * PRIMARY COLOR: Emerald Green (#10B981)
 * TYPOGRAPHY: Figtree (sans-serif)
 */

import { createSystem, defaultConfig } from '@chakra-ui/react';

/**
 * Chakra UI v3 System Configuration
 *
 * Usa createSystem com defaultConfig como base e estende com tokens personalizados.
 * Todos os tokens referenciam variáveis CSS do index.css para garantir consistência.
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
      // Fonts - referencing CSS variables from index.css
      fonts: {
        heading: { value: 'var(--font-sans)' },
        body: { value: 'var(--font-sans)' },
        mono: { value: 'var(--font-mono)' },
      },

      // Font Sizes - referencing CSS variables from index.css
      fontSizes: {
        xs: { value: 'var(--font-size-xs)' },      // 12px
        sm: { value: 'var(--font-size-sm)' },      // 14px
        md: { value: 'var(--font-size-base)' },    // 16px
        lg: { value: 'var(--font-size-lg)' },      // 18px
        xl: { value: 'var(--font-size-xl)' },      // 20px
        '2xl': { value: 'var(--font-size-2xl)' },  // 24px
        '3xl': { value: 'var(--font-size-3xl)' },  // 30px
        '4xl': { value: 'var(--font-size-4xl)' },  // 36px
        '5xl': { value: 'var(--font-size-5xl)' },  // 48px
        '6xl': { value: 'var(--font-size-6xl)' },  // 60px
      },

      // Font Weights - referencing CSS variables from index.css
      fontWeights: {
        thin: { value: 'var(--font-weight-thin)' },
        extralight: { value: 'var(--font-weight-extralight)' },
        light: { value: 'var(--font-weight-light)' },
        normal: { value: 'var(--font-weight-normal)' },
        medium: { value: 'var(--font-weight-medium)' },
        semibold: { value: 'var(--font-weight-semibold)' },
        bold: { value: 'var(--font-weight-bold)' },
        extrabold: { value: 'var(--font-weight-extrabold)' },
        black: { value: 'var(--font-weight-black)' },
      },

      // Line Heights - referencing CSS variables from index.css
      lineHeights: {
        none: { value: 'var(--line-height-none)' },
        tight: { value: 'var(--line-height-tight)' },
        snug: { value: 'var(--line-height-snug)' },
        normal: { value: 'var(--line-height-normal)' },
        relaxed: { value: 'var(--line-height-relaxed)' },
        loose: { value: 'var(--line-height-loose)' },
      },

      // Letter Spacing - referencing CSS variables from index.css
      letterSpacings: {
        tighter: { value: 'var(--letter-spacing-tighter)' },
        tight: { value: 'var(--letter-spacing-tight)' },
        normal: { value: 'var(--letter-spacing-normal)' },
        wide: { value: 'var(--letter-spacing-wide)' },
        wider: { value: 'var(--letter-spacing-wider)' },
        widest: { value: 'var(--letter-spacing-widest)' },
      },

      // Spacing - referencing CSS variables from index.css
      spacing: {
        0: { value: 'var(--space-0)' },
        px: { value: 'var(--space-px)' },
        0.5: { value: 'var(--space-0-5)' },
        1: { value: 'var(--space-1)' },
        1.5: { value: 'var(--space-1-5)' },
        2: { value: 'var(--space-2)' },
        2.5: { value: 'var(--space-2-5)' },
        3: { value: 'var(--space-3)' },
        3.5: { value: 'var(--space-3-5)' },
        4: { value: 'var(--space-4)' },
        5: { value: 'var(--space-5)' },
        6: { value: 'var(--space-6)' },
        7: { value: 'var(--space-7)' },
        8: { value: 'var(--space-8)' },
        9: { value: 'var(--space-9)' },
        10: { value: 'var(--space-10)' },
        11: { value: 'var(--space-11)' },
        12: { value: 'var(--space-12)' },
        13: { value: 'var(--space-13)' },
        14: { value: 'var(--space-14)' },
        15: { value: 'var(--space-15)' },
        16: { value: 'var(--space-16)' },
        18: { value: 'var(--space-18)' },
        20: { value: 'var(--space-20)' },
        24: { value: 'var(--space-24)' },
        32: { value: 'var(--space-32)' },
        40: { value: 'var(--space-40)' },
        48: { value: 'var(--space-48)' },
        56: { value: 'var(--space-56)' },
        64: { value: 'var(--space-64)' },
      },

      // Border Radius - referencing CSS variables from index.css
      radii: {
        none: { value: 'var(--radius-none)' },
        xs: { value: 'var(--radius-xs)' },
        sm: { value: 'var(--radius-sm)' },
        md: { value: 'var(--radius-md)' },
        lg: { value: 'var(--radius-lg)' },
        xl: { value: 'var(--radius-xl)' },
        '2xl': { value: 'var(--radius-2xl)' },
        '3xl': { value: 'var(--radius-3xl)' },
        full: { value: 'var(--radius-full)' },
      },

      // Shadows - referencing CSS variables from index.css
      shadows: {
        xs: { value: 'var(--shadow-xs)' },
        sm: { value: 'var(--shadow-sm)' },
        md: { value: 'var(--shadow-md)' },
        lg: { value: 'var(--shadow-lg)' },
        xl: { value: 'var(--shadow-xl)' },
        '2xl': { value: 'var(--shadow-2xl)' },
        inner: { value: 'var(--shadow-inner)' },
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
