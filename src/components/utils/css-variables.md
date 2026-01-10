# CSS Variables com Chakra UI

CSS Variables são uma forma poderosa de criar valores compartilhados no Chakra UI, evitando interpolações de props, regeneração de classnames e reduzindo a avaliação em runtime de valores de tokens.

## Visão Geral

O Chakra UI v3 permite usar CSS Variables que são "token-aware", ou seja, você pode referenciar diretamente os tokens do tema através de variáveis CSS.

## Exemplos Básicos

### CSS Variable Simples

```tsx
<Box css={{ '--font-size': '18px' }}>
  <h3 style={{ fontSize: 'calc(var(--font-size) * 2)' }}>Título</h3>
  <p style={{ fontSize: 'var(--font-size)' }}>Texto</p>
</Box>
```

### Acessando Tokens

Use o caminho completo do token para acessar valores do tema:

```tsx
// Cores
<Box css={{ '--color': 'colors.brand.500' }}>
  <p style={{ color: 'var(--color)' }}>Texto</p>
</Box>

// Tamanhos
<Box css={{ '--size': 'sizes.10' }}>
  <div style={{ width: 'var(--size)', height: 'var(--size)' }} />
</Box>

// Spacing
<Box css={{ '--spacing': 'spacing.6' }}>
  <div style={{ padding: 'var(--spacing)' }}>Conteúdo</div>
</Box>

// Font Sizes
<Box css={{ '--font-size': 'fontSizes.lg' }}>
  <p style={{ fontSize: 'var(--font-size)' }}>Texto</p>
</Box>

// Border Radius
<Box css={{ '--radius': 'radii.lg' }}>
  <div style={{ borderRadius: 'var(--radius)' }}>Card</div>
</Box>

// Shadows
<Box css={{ '--shadow': 'shadows.md' }}>
  <div style={{ boxShadow: 'var(--shadow)' }}>Card</div>
</Box>
```

## Estilos Responsivos

Use a sintaxe responsiva para tornar CSS variables responsivas:

```tsx
<Box css={{ '--font-size': { base: '18px', lg: '24px' } }}>
  <h3 style={{ fontSize: 'calc(var(--font-size) * 2)' }}>Título</h3>
  <p style={{ fontSize: 'var(--font-size)' }}>Texto</p>
</Box>

// Com tokens
<Box css={{ '--padding': { base: 'spacing.4', md: 'spacing.6', lg: 'spacing.8' } }}>
  <div style={{ padding: 'var(--padding)' }}>Conteúdo</div>
</Box>
```

## Modificador de Opacidade

Ao acessar tokens de cor, você pode usar o modificador de opacidade. É necessário usar a sintaxe `{}`:

```tsx
<Box css={{ '--color': '{colors.brand.500/40}' }}>
  <p style={{ color: 'var(--color)' }}>Texto com 40% de opacidade</p>
</Box>

// Valores de opacidade disponíveis: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
<Box css={{ '--bg-color': '{colors.brand.500/20}' }}>
  <div style={{ backgroundColor: 'var(--bg-color)' }}>Background transparente</div>
</Box>
```

## Virtual Color (colorPalette)

Variáveis podem apontar para uma cor virtual através do valor `colors.colorPalette.*`. Isso é útil para criar componentes temáticos:

```tsx
<Box colorPalette="brand" css={{ '--color': 'colors.colorPalette.500' }}>
  <Button style={{ backgroundColor: 'var(--color)', color: 'white' }}>
    Botão
  </Button>
</Box>

// Múltiplas variáveis com colorPalette
<Box colorPalette="blue" css={{
  '--bg': 'colors.colorPalette.100',
  '--text': 'colors.colorPalette.700',
  '--border': 'colors.colorPalette.300',
}}>
  <div style={{
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
    borderColor: 'var(--border)',
    borderWidth: '1px',
    padding: '16px',
  }}>
    Card temático
  </div>
</Box>
```

## Valores Calculados

Você pode usar `calc()` com CSS variables:

```tsx
<Box css={{ '--base-size': 'sizes.10', '--spacing': 'spacing.4' }}>
  <div style={{
    width: 'calc(var(--base-size) * 2)',
    height: 'var(--base-size)',
    padding: 'var(--spacing)',
  }}>
    Elemento calculado
  </div>
</Box>
```

## Exemplo Complexo

```tsx
<Box
  css={{
    '--card-padding': { base: 'spacing.4', md: 'spacing.6', lg: 'spacing.8' },
    '--card-radius': { base: 'radii.md', md: 'radii.lg', lg: 'radii.xl' },
    '--card-shadow': 'shadows.md',
    '--card-bg': 'colors.card',
    '--card-text': 'colors.card.fg',
    '--title-size': { base: 'fontSizes.lg', md: 'fontSizes.xl', lg: 'fontSizes.2xl' },
  }}
>
  <Box
    style={{
      padding: 'var(--card-padding)',
      backgroundColor: 'var(--card-bg)',
      color: 'var(--card-text)',
      borderRadius: 'var(--card-radius)',
      boxShadow: 'var(--card-shadow)',
    }}
  >
    <h2 style={{ fontSize: 'var(--title-size)' }}>Título</h2>
    <p>Conteúdo do card</p>
  </Box>
</Box>
```

## Tokens Disponíveis

### Cores
- `colors.brand.*` - Cores da marca (50-900)
- `colors.primary` - Cor primária
- `colors.success` - Cor de sucesso
- `colors.error` - Cor de erro
- `colors.warning` - Cor de aviso
- `colors.info` - Cor de informação
- `colors.colorPalette.*` - Virtual color (requer `colorPalette` prop)

### Tamanhos
- `sizes.*` - Tamanhos (0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, etc.)
- `sizes.container.*` - Tamanhos de container (sm, md, lg, xl, 2xl)

### Espaçamento
- `spacing.*` - Espaçamento (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)

### Tipografia
- `fontSizes.*` - Tamanhos de fonte (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)
- `fontWeights.*` - Pesos de fonte (normal, medium, semibold, bold)
- `lineHeights.*` - Alturas de linha (none, tight, snug, normal, relaxed, loose)

### Outros
- `radii.*` - Border radius (none, sm, md, lg, xl, 2xl, 3xl, full)
- `shadows.*` - Sombras (xs, sm, md, lg, xl)

## Vantagens

1. **Performance**: Evita regeneração de classnames
2. **Flexibilidade**: Permite cálculos dinâmicos com `calc()`
3. **Consistência**: Usa tokens do tema diretamente
4. **Responsividade**: Suporta valores responsivos
5. **Manutenibilidade**: Centraliza valores em variáveis

## Quando Usar

✅ **Use CSS Variables quando:**
- Você precisa de valores calculados dinamicamente
- Quer evitar prop drilling de valores
- Precisa de valores que mudam em runtime
- Quer criar componentes altamente customizáveis

❌ **Não use quando:**
- Props do Chakra UI já resolvem seu caso
- Você não precisa de cálculos dinâmicos
- A performance não é crítica

## Ver também

- [Storybook - CSS Variables Examples](./css-variables.stories.tsx)
- [Documentação do Chakra UI](https://chakra-ui.com/docs/styling/css-variables)
