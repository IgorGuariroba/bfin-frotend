/**
 * Theme exports
 *
 * Re-exporta o sistema de tema e utilitários de tokens
 */
export { system } from './theme';
export { cssVar, iconColors, colorTokens, customShadows } from './tokens';
export type { IconColor, BrandShade } from './tokens';

// Tipos gerados pelo Chakra UI CLI
// Execute `npm run theme:typegen` para gerar estes tipos
export type {
  ColorToken,
  SpacingToken,
  FontSizeToken,
  FontWeightToken,
  LineHeightToken,
  LetterSpacingToken,
  RadiusToken,
  ShadowToken,
  ZIndexToken,
} from './theme.types';
