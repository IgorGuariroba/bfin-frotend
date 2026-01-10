# Chakra Factory

O Chakra Factory (`chakra`) permite criar componentes HTML customizados que automaticamente recebem todas as props de estilo do Chakra UI.

## Importação

```tsx
import { chakra } from '@chakra-ui/react';
```

## Uso Básico

### Criar um componente HTML customizado

```tsx
const CustomDiv = chakra('div');

// Agora você pode usar todas as props do Chakra UI
<CustomDiv bg="brand.500" color="white" p={4} borderRadius="md">
  Conteúdo
</CustomDiv>
```

### Criar componentes HTML nativos

```tsx
const NativeButton = chakra('button');
const NativeInput = chakra('input');
const NativeForm = chakra('form');
const NativeLabel = chakra('label');

// Use com props do Chakra
<NativeButton
  bg="brand.500"
  color="white"
  px={4}
  py={2}
  borderRadius="md"
  _hover={{ bg: 'brand.600' }}
>
  Botão
</NativeButton>
```

## Componentes com Estilos Base

Você pode criar componentes com estilos padrão:

```tsx
const StyledCard = chakra('div', {
  baseStyle: {
    bg: 'card',
    color: 'card.fg',
    borderRadius: 'lg',
    p: 6,
    shadow: 'md',
  },
});

// Use sem precisar passar todas as props
<StyledCard>
  Conteúdo do card
</StyledCard>

// Mas ainda pode sobrescrever
<StyledCard bg="brand.500" color="white">
  Card customizado
</StyledCard>
```

## Exemplos de Elementos HTML

### Elementos de Layout

```tsx
const CustomSection = chakra('section');
const CustomArticle = chakra('article');
const CustomHeader = chakra('header');
const CustomFooter = chakra('footer');
const CustomNav = chakra('nav');
const CustomMain = chakra('main');
const CustomAside = chakra('aside');
```

### Elementos de Texto

```tsx
const CustomH1 = chakra('h1');
const CustomH2 = chakra('h2');
const CustomH3 = chakra('h3');
const CustomParagraph = chakra('p');
const CustomSpan = chakra('span');
```

### Elementos de Formulário

```tsx
const NativeInput = chakra('input');
const NativeButton = chakra('button');
const NativeForm = chakra('form');
const NativeLabel = chakra('label');
const NativeSelect = chakra('select');
const NativeTextarea = chakra('textarea');
```

### Elementos de Tabela

```tsx
const CustomTable = chakra('table');
const CustomThead = chakra('thead');
const CustomTbody = chakra('tbody');
const CustomTr = chakra('tr');
const CustomTd = chakra('td');
const CustomTh = chakra('th');
```

### Elementos de Lista

```tsx
const CustomUl = chakra('ul');
const CustomOl = chakra('ol');
const CustomLi = chakra('li');
```

### Elementos de Mídia

```tsx
const CustomImage = chakra('img');
const CustomVideo = chakra('video');
const CustomAudio = chakra('audio');
```

### SVG

```tsx
const CustomSvg = chakra('svg');
const CustomPath = chakra('path');
const CustomCircle = chakra('circle');
const CustomRect = chakra('rect');
```

## Props Disponíveis

Todos os componentes criados com `chakra` suportam:

### Props de Estilo

- `bg`, `color`, `border`, `borderRadius`
- `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr` (padding)
- `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr` (margin)
- `w`, `h`, `minW`, `minH`, `maxW`, `maxH`
- `fontSize`, `fontWeight`, `fontFamily`
- `textAlign`, `lineHeight`
- `shadow`, `opacity`
- E muito mais...

### Props Responsivas

```tsx
<CustomDiv
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
  p={{ base: 4, md: 6, lg: 8 }}
>
  Conteúdo responsivo
</CustomDiv>
```

### Pseudo-estados

```tsx
<CustomDiv
  bg="brand.500"
  _hover={{ bg: 'brand.600' }}
  _active={{ bg: 'brand.700' }}
  _focus={{ outline: '2px solid', outlineColor: 'brand.500' }}
  _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
>
  Conteúdo
</CustomDiv>
```

## Quando Usar

### ✅ Use Chakra Factory quando:

- Você precisa de um elemento HTML específico que não existe no Chakra UI
- Você quer criar componentes HTML nativos com props do Chakra
- Você precisa de elementos semânticos (section, article, header, etc.)
- Você quer criar componentes reutilizáveis com estilos base

### ❌ Não use quando:

- O Chakra UI já tem um componente equivalente (use o componente do Chakra)
- Você precisa de funcionalidades específicas do Chakra (use os componentes do Chakra)

## Exemplos Práticos

### Card Customizado

```tsx
const StyledCard = chakra('div', {
  baseStyle: {
    bg: 'card',
    color: 'card.fg',
    borderRadius: 'lg',
    p: 6,
    shadow: 'md',
  },
});

<StyledCard>
  <CustomH2 fontSize="xl" fontWeight="bold">Título</CustomH2>
  <CustomParagraph>Conteúdo do card</CustomParagraph>
</StyledCard>
```

### Badge Customizado

```tsx
const StyledBadge = chakra('span', {
  baseStyle: {
    display: 'inline-block',
    px: 2,
    py: 1,
    borderRadius: 'md',
    fontSize: 'sm',
    fontWeight: 'semibold',
  },
});

<StyledBadge bg="brand.500" color="white">Novo</StyledBadge>
```

### Container Responsivo

```tsx
const StyledContainer = chakra('div', {
  baseStyle: {
    maxW: 'container.xl',
    mx: 'auto',
    px: { base: 4, md: 6, lg: 8 },
  },
});

<StyledContainer>
  Conteúdo centralizado e responsivo
</StyledContainer>
```

## Vantagens

1. **Flexibilidade**: Crie qualquer elemento HTML com props do Chakra
2. **Consistência**: Use o mesmo sistema de design em todos os componentes
3. **TypeScript**: Tipagem completa e autocomplete
4. **Performance**: Componentes otimizados
5. **Semântica**: Use elementos HTML semânticos corretos

## CSS Variables

O Chakra UI permite usar CSS Variables que são "token-aware", permitindo referenciar diretamente os tokens do tema.

### Exemplo Básico

```tsx
<Box css={{ '--color': 'colors.brand.500' }}>
  <p style={{ color: 'var(--color)' }}>Texto</p>
</Box>
```

### Com Opacidade

```tsx
<Box css={{ '--color': '{colors.brand.500/40}' }}>
  <p style={{ color: 'var(--color)' }}>Texto com 40% opacidade</p>
</Box>
```

### Responsivo

```tsx
<Box css={{ '--font-size': { base: '18px', lg: '24px' } }}>
  <p style={{ fontSize: 'var(--font-size)' }}>Texto responsivo</p>
</Box>
```

### Virtual Color

```tsx
<Box colorPalette="brand" css={{ '--color': 'colors.colorPalette.500' }}>
  <Button style={{ backgroundColor: 'var(--color)' }}>Botão</Button>
</Box>
```

📖 **Documentação completa**: [CSS Variables Guide](./css-variables.md)
🎨 **Exemplos no Storybook**: `Utils/CSS Variables`

## Ver também

- [Documentação do Chakra UI v3](https://chakra-ui.com)
- [Storybook - Chakra Factory Examples](./chakra-factory.stories.tsx)
- [Storybook - CSS Variables Examples](./css-variables.stories.tsx)
- [CSS Variables Guide](./css-variables.md)
