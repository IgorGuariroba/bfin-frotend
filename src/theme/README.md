# BFIN Design System

Sistema de design baseado em Chakra UI v3 com tokens customizados.

## Arquitetura

- **Cores**: Definidas em `index.css` como variáveis CSS
- **Tema**: Mapeia variáveis CSS para tokens do Chakra UI v3
- **Mudanças de cor**: Devem ser feitas APENAS em `index.css`

## Cores

### Brand (Purple)
Escala de roxo principal do design system:

- `brand.50` - Muito claro (#FAFAFF)
- `brand.100` - Claro (#F3E8FF)
- `brand.200` - Suave (#E9D5FF)
- `brand.300` - Médio (#D8B4FE)
- `brand.400` - Claro (#C084FC)
- `brand.500` - Base (#7C3AED) ⭐ PRIMARY
- `brand.600` - Escuro (#7C3AED)
- `brand.700` - Muito escuro (#6D28D9)
- `brand.800` - Mais escuro (#5B21B6)
- `brand.900` - Muito escuro (#4C1D95)

### Cores Semânticas

#### Primary
- `primary` / `primary.fg` - Cor principal (botões, links principais)

#### Secondary
- `secondary` / `secondary.fg` - Cor secundária (botões secundários)

#### Estados
- `success` / `success.fg` - Sucesso (confirmações, validações)
- `error` / `error.fg` - Erro (mensagens de erro, validações)
- `warning` / `warning.fg` - Aviso (alertas, avisos)
- `info` / `info.fg` - Informação (mensagens informativas)

#### Interface
- `bg` / `fg` - Background e foreground principais
- `card` / `card.fg` - Superfícies de cards
- `muted` / `muted.fg` - Elementos desabilitados/placeholders
- `border` - Bordas
- `accent` / `accent.fg` - Destaques, hover states

## Tipografia

### Fontes
- `heading` - 'Figtree', sans-serif
- `body` - 'Figtree', sans-serif
- `mono` - ui-monospace, SFMono-Regular, etc.

### Tamanhos
- `xs` - 12px (0.75rem)
- `sm` - 14px (0.875rem)
- `md` - 16px (1rem)
- `lg` - 18px (1.125rem)
- `xl` - 20px (1.25rem)
- `2xl` - 24px (1.5rem)
- `3xl` - 30px (1.875rem)
- `4xl` - 36px (2.25rem)
- `5xl` - 48px (3rem)

### Pesos
- `normal` - 400
- `medium` - 500
- `semibold` - 600
- `bold` - 700

## Espaçamento

Baseado em grid de 4px:

- `0` - 0
- `1` - 4px (0.25rem)
- `2` - 8px (0.5rem)
- `3` - 12px (0.75rem)
- `4` - 16px (1rem)
- `5` - 20px (1.25rem)
- `6` - 24px (1.5rem)
- `8` - 32px (2rem)
- `10` - 40px (2.5rem)
- `12` - 48px (3rem)
- `16` - 64px (4rem)
- `20` - 80px (5rem)
- `24` - 96px (6rem)

## Border Radius

- `none` - 0
- `sm` - 2px (0.125rem)
- `md` - 6px (0.375rem)
- `lg` - 8px (0.5rem)
- `xl` - 12px (0.75rem)
- `2xl` - 16px (1rem)
- `3xl` - 24px (1.5rem)
- `full` - 9999px (círculo completo)

## Shadows

- `xs` - Sombra extra pequena
- `sm` - Sombra pequena
- `md` - Sombra média
- `lg` - Sombra grande
- `xl` - Sombra extra grande

## Uso

### Exemplos de Cores

```tsx
// Brand color
<Button colorPalette="brand">Brand Button</Button>

// Semantic colors
<Box bg="primary" color="primary.fg">Primary Box</Box>
<Box bg="success" color="success.fg">Success Box</Box>
<Box bg="error" color="error.fg">Error Box</Box>

// Interface colors
<Box bg="card" color="card.fg">Card</Box>
<Box bg="muted" color="muted.fg">Muted</Box>
```

### Exemplos de Tipografia

```tsx
<Heading fontSize="2xl" fontWeight="bold">Título</Heading>
<Text fontSize="md" lineHeight="normal">Texto normal</Text>
<Text fontFamily="mono">Código</Text>
```

### Exemplos de Espaçamento

```tsx
<Stack gap={4}> {/* 16px */}
  <Box p={6}> {/* 24px padding */}
    <Text mb={2}>Texto</Text> {/* 8px margin-bottom */}
  </Box>
</Stack>
```

### Exemplos de Border Radius

```tsx
<Box borderRadius="lg">Rounded Box</Box>
<Button borderRadius="full">Circular Button</Button>
```

### Exemplos de Shadows

```tsx
<Card shadow="md">Card com sombra média</Card>
<Box shadow="lg">Box com sombra grande</Box>
```

## Acessibilidade

O design system segue as diretrizes WCAG AA:

- **Texto normal**: Contraste mínimo de 4.5:1
- **Texto grande** (18px+ ou 14px+ bold): Contraste mínimo de 3:1
- **Componentes UI**: Contraste mínimo de 3:1

Todas as cores foram verificadas para garantir contraste adequado.

## Breakpoints

O sistema usa breakpoints mobile-first:

- **base**: 0em (0px) - Mobile (padrão)
- **sm**: 30em (480px) - Small devices
- **md**: 48em (768px) - Tablets
- **lg**: 62em (992px) - Desktop
- **xl**: 80em (1280px) - Large desktop
- **2xl**: 96em (1536px) - Extra large desktop

### Uso de Breakpoints

```tsx
// Props responsivas
<Box
  p={{ base: 4, md: 6, lg: 8 }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
  display={{ base: 'block', md: 'flex' }}
>
  Conteúdo responsivo
</Box>

// Grid responsivo
<Grid
  templateColumns={{
    base: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)'
  }}
>
  {/* Itens */}
</Grid>

// Visibilidade responsiva
<Box display={{ base: 'none', md: 'block' }}>
  Visível apenas em tablets e acima
</Box>
```

## Customização

Para alterar cores, edite apenas `src/index.css`. O tema do Chakra UI será atualizado automaticamente através das variáveis CSS.

Para adicionar novos tokens, edite `src/theme/theme.ts`.

Para alterar breakpoints, edite `src/theme/theme.ts` na seção `breakpoints`.
