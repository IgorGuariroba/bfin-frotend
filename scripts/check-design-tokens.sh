#!/bin/bash

echo "Verificando uso de design tokens..."
echo ""

ERRORS=0

echo "Buscando cores hardcoded em componentes e paginas..."
HARDCODED_COLORS=$(rg -n "(rgba?\([0-9]|#[0-9a-fA-F]{3,8}['\"]|hsl\([0-9])" --glob "*.tsx" --glob "!*.stories.tsx" --glob "!*.test.tsx" src/components/ src/pages/ 2>/dev/null | grep -v "// token:" | grep -v "// ok:")

if [ -n "$HARDCODED_COLORS" ]; then
  echo "Cores hardcoded encontradas:"
  echo "$HARDCODED_COLORS"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "Nenhuma cor hardcoded encontrada"
fi

echo ""
echo "Verificando uso de variaveis CSS de paleta diretamente..."
PALETTE_VARS=$(rg -n "var\(--primary-[0-9]|var\(--gray-[0-9]|var\(--blue-[0-9]|var\(--red-[0-9]|var\(--chakra-colors-" --glob "*.tsx" --glob "!*.stories.tsx" --glob "!*.test.tsx" src/components/ src/pages/ 2>/dev/null | grep -v "// ok:" | grep -v "tokens.ts")

if [ -n "$PALETTE_VARS" ]; then
  echo "Variaveis de paleta usadas diretamente (use iconColors ou tokens):"
  echo "$PALETTE_VARS"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "Nenhuma variavel de paleta usada diretamente"
fi

echo ""
echo "Verificando uso de colorScheme (deprecado no Chakra v3)..."
COLOR_SCHEME=$(rg -n "colorScheme=" --glob "*.tsx" src/components/ src/pages/ 2>/dev/null)

if [ -n "$COLOR_SCHEME" ]; then
  echo "Uso de colorScheme encontrado (use colorPalette no Chakra v3):"
  echo "$COLOR_SCHEME"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "Nenhum uso de colorScheme deprecado"
fi

echo ""
echo "Buscando inline styles..."
INLINE_STYLES=$(rg -n "style=\{\{" --glob "*.tsx" --glob "!*.stories.tsx" --glob "!*.test.tsx" src/components/ src/pages/ 2>/dev/null | grep -v "// ok:" | head -10)

if [ -n "$INLINE_STYLES" ]; then
  echo "Inline styles encontrados (prefira props do Chakra):"
  echo "$INLINE_STYLES"
  echo ""
fi

echo ""
echo "----------------------------------------"
if [ $ERRORS -gt 0 ]; then
  echo "Encontrados $ERRORS problemas de design tokens"
  exit 1
else
  echo "Verificacao concluida com sucesso"
  exit 0
fi
