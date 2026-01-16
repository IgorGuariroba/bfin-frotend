/**
 * Design System Tokens
 *
 * Este arquivo centraliza o acesso aos tokens do Design System.
 * Use estas constantes e funções em vez de variáveis CSS diretas.
 *
 * ARQUITETURA:
 * - index.css: Define as variáveis CSS (Single Source of Truth)
 * - theme.ts: Mapeia para o Chakra UI
 * - tokens.ts: Exporta utilitários para uso nos componentes
 */

/**
 * Converte um token do Chakra UI para variável CSS
 * Útil para props que não aceitam tokens (ex: color em ícones Lucide)
 *
 * @example
 * // Para ícones Lucide
 * <Check color={cssVar('brand.600')} />
 * <Zap color={cssVar('primary')} />
 */
export function cssVar(token: string): string {
  // Tokens semânticos simples (sem ponto)
  const semanticTokens: Record<string, string> = {
    'primary': '--primary',
    'primary.fg': '--primary-foreground',
    'secondary': '--secondary',
    'secondary.fg': '--secondary-foreground',
    'muted': '--muted',
    'muted.fg': '--muted-foreground',
    'accent': '--accent',
    'accent.fg': '--accent-foreground',
    'card': '--card',
    'card.fg': '--card-foreground',
    'background': '--background',
    'foreground': '--foreground',
    'border': '--border',
    'success': '--success',
    'success.fg': '--success-foreground',
    'warning': '--warning',
    'warning.fg': '--warning-foreground',
    'error': '--destructive',
    'error.fg': '--destructive-foreground',
    'info': '--info',
    'info.fg': '--info-foreground',
  };

  // Se for um token semântico, usa o mapeamento direto
  if (semanticTokens[token]) {
    return `var(${semanticTokens[token]})`;
  }

  // Para tokens de paleta (brand.600, gray.200, etc.)
  // Converte brand.600 -> --primary-600, gray.200 -> --gray-200
  const [palette, shade] = token.split('.');

  if (palette === 'brand') {
    return `var(--primary-${shade})`;
  }

  return `var(--${palette}-${shade})`;
}

/**
 * Cores pré-definidas para uso em ícones e outros elementos que precisam de CSS direto
 *
 * @example
 * <Check color={iconColors.brand} />
 * <AlertCircle color={iconColors.error} />
 */
export const iconColors = {
  // Brand/Primary
  brand: 'var(--primary)',
  brandLight: 'var(--primary-400)',
  brandDark: 'var(--primary-600)',

  // Semantic
  primary: 'var(--primary)',
  primaryFg: 'var(--primary-foreground)',
  muted: 'var(--muted-foreground)',
  card: 'var(--card-foreground)',

  // Status
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--destructive)',
  info: 'var(--info)',

  // Neutral
  white: 'white',
  black: 'black',
  gray: 'var(--gray-500)',
  grayLight: 'var(--gray-400)',
  grayDark: 'var(--gray-600)',
} as const;

/**
 * Tokens de cores para uso em props do Chakra UI
 * Exportados para referência e autocomplete
 */
export const colorTokens = {
  // Brand palette
  brand: {
    50: 'brand.50',
    100: 'brand.100',
    200: 'brand.200',
    300: 'brand.300',
    400: 'brand.400',
    500: 'brand.500',
    600: 'brand.600',
    700: 'brand.700',
    800: 'brand.800',
    900: 'brand.900',
    950: 'brand.950',
  },

  // Semantic colors (para bg, color, borderColor, etc.)
  semantic: {
    primary: 'primary',
    primaryFg: 'primary.fg',
    secondary: 'secondary',
    secondaryFg: 'secondary.fg',
    muted: 'muted',
    mutedFg: 'muted.fg',
    accent: 'accent',
    accentFg: 'accent.fg',
    card: 'card',
    cardFg: 'card.fg',
    background: 'bg',
    foreground: 'fg',
    border: 'border',
  },

  // Status colors
  status: {
    success: 'success',
    successFg: 'success.fg',
    warning: 'warning',
    warningFg: 'warning.fg',
    error: 'error',
    errorFg: 'error.fg',
    info: 'info',
    infoFg: 'info.fg',
  },
} as const;

/**
 * Shadows customizados usando tokens de cor
 * Para uso em props boxShadow que precisam de valores CSS
 * // ok: valores rgba necessários para shadows com transparência
 */
export const customShadows = {
  whiteGlow: {
    sm: '0 2px 10px rgba(255, 255, 255, 0.1)', // ok: whiteAlpha.100
    md: '0 4px 20px rgba(255, 255, 255, 0.2)', // ok: whiteAlpha.200
    side: '2px 0 10px rgba(255, 255, 255, 0.1)', // ok: whiteAlpha.100
    top: '0 -2px 10px rgba(255, 255, 255, 0.1)', // ok: whiteAlpha.100
  },
  primaryGlow: {
    sm: '0 2px 10px var(--primary-200)',
    md: '0 4px 20px var(--primary-300)',
  },
} as const;

// Type exports para autocomplete
export type IconColor = keyof typeof iconColors;
export type BrandShade = keyof typeof colorTokens.brand;
