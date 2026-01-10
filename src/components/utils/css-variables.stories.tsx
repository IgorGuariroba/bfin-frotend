import type { Meta, StoryObj } from '@storybook/react';
import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';

const meta = {
  title: 'Utils/CSS Variables',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">CSS Variables Básicas</Text>

      <Box css={{ '--font-size': '18px' }}>
        <Text style={{ fontSize: 'calc(var(--font-size) * 2)' }} fontWeight="bold">
          Título (36px - 2x da variável)
        </Text>
        <Text style={{ fontSize: 'var(--font-size)' }}>
          Texto normal (18px - valor da variável)
        </Text>
      </Box>
    </VStack>
  ),
};

export const AccessTokens: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Acessando Tokens do Chakra</Text>

      <Box css={{ '--color': 'colors.brand.500' }}>
        <Text style={{ color: 'var(--color)' }} fontSize="lg" fontWeight="semibold">
          Texto usando token de cor brand.500
        </Text>
      </Box>

      <Box css={{ '--size': 'sizes.10' }}>
        <Box
          style={{
            width: 'var(--size)',
            height: 'var(--size)',
            backgroundColor: 'var(--colors-brand-500)',
            borderRadius: '8px',
          }}
        />
        <Text fontSize="sm" color="gray.600" mt={2}>
          Box 40px x 40px usando token de tamanho
        </Text>
      </Box>

      <Box css={{ '--spacing': 'spacing.6' }}>
        <Box
          style={{
            padding: 'var(--spacing)',
            backgroundColor: 'var(--colors-brand-100)',
            borderRadius: '8px',
          }}
        >
          <Text>Padding usando token de spacing (24px)</Text>
        </Box>
      </Box>
    </VStack>
  ),
};

export const ResponsiveStyles: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">CSS Variables Responsivas</Text>

      <Box css={{ '--font-size': { base: '16px', md: '18px', lg: '24px' } }}>
        <Text style={{ fontSize: 'var(--font-size)' }} fontWeight="semibold">
          Tamanho de fonte responsivo
        </Text>
        <Text fontSize="xs" color="gray.600" mt={1}>
          base: 16px, md: 18px, lg: 24px
        </Text>
      </Box>

      <Box css={{ '--padding': { base: 'spacing.4', md: 'spacing.6', lg: 'spacing.8' } }}>
        <Box
          style={{
            padding: 'var(--padding)',
            backgroundColor: 'var(--colors-brand-100)',
            borderRadius: '8px',
          }}
        >
          <Text>Padding responsivo usando tokens</Text>
          <Text fontSize="xs" color="gray.600" mt={1}>
            base: 16px, md: 24px, lg: 32px
          </Text>
        </Box>
      </Box>

      <Box css={{ '--border-radius': { base: 'radii.md', md: 'radii.lg', lg: 'radii.xl' } }}>
        <Box
          style={{
            padding: '16px',
            backgroundColor: 'var(--colors-brand-200)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <Text>Border radius responsivo</Text>
          <Text fontSize="xs" color="gray.600" mt={1}>
            base: 6px, md: 8px, lg: 12px
          </Text>
        </Box>
      </Box>
    </VStack>
  ),
};

export const ColorOpacityModifier: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Modificador de Opacidade</Text>

      <HStack gap={4} flexWrap="wrap">
        <Box css={{ '--color': '{colors.brand.500/100}' }}>
          <Box
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--color)',
              borderRadius: '8px',
            }}
          />
          <Text fontSize="xs" mt={1}>100%</Text>
        </Box>

        <Box css={{ '--color': '{colors.brand.500/80}' }}>
          <Box
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--color)',
              borderRadius: '8px',
            }}
          />
          <Text fontSize="xs" mt={1}>80%</Text>
        </Box>

        <Box css={{ '--color': '{colors.brand.500/60}' }}>
          <Box
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--color)',
              borderRadius: '8px',
            }}
          />
          <Text fontSize="xs" mt={1}>60%</Text>
        </Box>

        <Box css={{ '--color': '{colors.brand.500/40}' }}>
          <Box
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--color)',
              borderRadius: '8px',
            }}
          />
          <Text fontSize="xs" mt={1}>40%</Text>
        </Box>

        <Box css={{ '--color': '{colors.brand.500/20}' }}>
          <Box
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--color)',
              borderRadius: '8px',
            }}
          />
          <Text fontSize="xs" mt={1}>20%</Text>
        </Box>
      </HStack>

      <Box css={{ '--bg-color': '{colors.brand.500/20}' }}>
        <Box
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-color)',
            borderRadius: '8px',
          }}
        >
          <Text>Background com 20% de opacidade</Text>
        </Box>
      </Box>
    </VStack>
  ),
};

export const VirtualColor: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Virtual Color (colorPalette)</Text>

      <Box colorPalette="brand" css={{ '--color': 'colors.colorPalette.500' }}>
        <Button style={{ backgroundColor: 'var(--color)', color: 'white' }}>
          Botão com colorPalette brand
        </Button>
      </Box>

      <Box colorPalette="blue" css={{ '--color': 'colors.colorPalette.500' }}>
        <Button style={{ backgroundColor: 'var(--color)', color: 'white' }}>
          Botão com colorPalette blue
        </Button>
      </Box>

      <Box colorPalette="green" css={{ '--color': 'colors.colorPalette.500' }}>
        <Button style={{ backgroundColor: 'var(--color)', color: 'white' }}>
          Botão com colorPalette green
        </Button>
      </Box>

      <Box colorPalette="red" css={{ '--color': 'colors.colorPalette.500' }}>
        <Button style={{ backgroundColor: 'var(--color)', color: 'white' }}>
          Botão com colorPalette red
        </Button>
      </Box>

      <Box colorPalette="brand" css={{ '--bg': 'colors.colorPalette.100', '--text': 'colors.colorPalette.700' }}>
        <Box
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            borderRadius: '8px',
          }}
        >
          <Text fontWeight="semibold">Card usando colorPalette com múltiplas variáveis</Text>
        </Box>
      </Box>
    </VStack>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Exemplo Complexo</Text>

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
          <Text
            style={{ fontSize: 'var(--title-size)' }}
            fontWeight="bold"
            mb={2}
          >
            Card Customizado com CSS Variables
          </Text>
          <Text>
            Este card usa múltiplas CSS variables com tokens do Chakra UI,
            incluindo valores responsivos e acesso direto aos tokens do tema.
          </Text>
        </Box>
      </Box>
    </VStack>
  ),
};

export const CalculatedValues: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Valores Calculados</Text>

      <Box css={{ '--base-size': 'sizes.10', '--spacing': 'spacing.4' }}>
        <Box
          style={{
            width: 'calc(var(--base-size) * 2)',
            height: 'var(--base-size)',
            padding: 'var(--spacing)',
            backgroundColor: 'var(--colors-brand-500)',
            borderRadius: '8px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text fontWeight="semibold">
            Largura: 2x base-size (80px), Altura: base-size (40px)
          </Text>
        </Box>
      </Box>

      <Box css={{ '--font-size': 'fontSizes.md', '--line-height': '1.5' }}>
        <Text
          style={{
            fontSize: 'var(--font-size)',
            lineHeight: 'calc(var(--font-size) * var(--line-height))',
          }}
        >
          Texto com line-height calculado (fontSize * 1.5)
        </Text>
      </Box>

      <Box css={{ '--gap': 'spacing.4' }}>
        <HStack
          style={{
            gap: 'calc(var(--gap) * 2)',
          }}
        >
          <Box bg="brand.100" p={4} borderRadius="md">Item 1</Box>
          <Box bg="brand.100" p={4} borderRadius="md">Item 2</Box>
          <Box bg="brand.100" p={4} borderRadius="md">Item 3</Box>
        </HStack>
        <Text fontSize="xs" color="gray.600" mt={1}>
          Gap: 2x spacing.4 (32px)
        </Text>
      </Box>
    </VStack>
  ),
};
