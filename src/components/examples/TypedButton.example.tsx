/**
 * Exemplo de componente usando tipos gerados do Chakra Theme Tool
 *
 * Execute `npm run theme:typegen` primeiro para gerar os tipos
 */

import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

// NOTA: Descomente as linhas abaixo depois de executar `npm run theme:typegen`
// import type { ColorToken, SpacingToken } from '../../theme';

interface TypedButtonProps extends Omit<ChakraButtonProps, 'bg' | 'color' | 'p' | 'm'> {
  children: React.ReactNode;

  // NOTA: Descomente e use os tipos gerados para autocomplete completo
  // bg?: ColorToken;           // Autocomplete: brand.50, brand.500, primary, etc.
  // color?: ColorToken;        // Autocomplete: brand.50, brand.500, primary, etc.
  // p?: SpacingToken;          // Autocomplete: 0, 1, 2, 3, 4, etc.
  // m?: SpacingToken;          // Autocomplete: 0, 1, 2, 3, 4, etc.

  // Temporário: Enquanto não temos os tipos gerados
  bg?: string;
  color?: string;
  p?: string | number;
  m?: string | number;
}

/**
 * Exemplo de botão tipado que usa os tokens do design system
 *
 * Com tipos gerados, você terá:
 * - Autocomplete para todas as cores (brand.50, brand.500, primary, etc.)
 * - Autocomplete para espaçamento (0, 1, 2, 3, 4, etc.)
 * - Type safety em tempo de compilação
 * - Detecção de erros para valores inválidos
 */
export function TypedButton({
  children,
  bg = 'brand.500',    // ✅ Depois dos tipos: autocomplete completo
  color = 'primary.fg', // ✅ Depois dos tipos: autocomplete completo
  p = 4,               // ✅ Depois dos tipos: autocomplete completo
  m = 0,               // ✅ Depois dos tipos: autocomplete completo
  ...props
}: TypedButtonProps) {
  return (
    <ChakraButton
      colorPalette="brand"
      bg={bg}
      color={color}
      p={p}
      m={m}
      {...props}
    >
      {children}
    </ChakraButton>
  );
}

/**
 * Exemplo de uso:
 *
 * <TypedButton
 *   bg="brand.600"     // ✅ Autocomplete mostrará todas as opções
 *   color="primary.fg" // ✅ Autocomplete mostrará todas as opções
 *   p={6}              // ✅ Autocomplete mostrará todas as opções
 * >
 *   Clique aqui
 * </TypedButton>
 */