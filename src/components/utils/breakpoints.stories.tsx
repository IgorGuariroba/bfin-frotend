import type { Meta, StoryObj } from '@storybook/react';
import { Box, VStack, HStack, Text, Grid } from '@chakra-ui/react';

const meta = {
  title: 'Utils/Breakpoints',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResponsiveBox: Story = {
  render: () => (
    <VStack gap={4} p={4} align="stretch">
      <Box
        bg="brand.500"
        color="white"
        p={{ base: 4, md: 6, lg: 8 }}
        fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
        borderRadius={{ base: 'md', md: 'lg', lg: 'xl' }}
        textAlign={{ base: 'left', md: 'center' }}
      >
        <Text fontWeight="bold" mb={2}>Box Responsivo</Text>
        <Text fontSize={{ base: 'xs', md: 'sm' }}>
          Padding: base=16px, md=24px, lg=32px
          <br />
          Font Size: base=14px, md=16px, lg=18px
          <br />
          Border Radius: base=6px, md=8px, lg=12px
        </Text>
      </Box>
    </VStack>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <VStack gap={4} p={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Grid Responsivo</Text>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
        gap={4}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <Box
            key={num}
            bg="brand.100"
            p={4}
            borderRadius="md"
            textAlign="center"
          >
            <Text fontWeight="bold" color="brand.700">
              Item {num}
            </Text>
            <Text fontSize="xs" color="brand.600" mt={1}>
              base: 1 col, md: 2 cols, lg: 3 cols, xl: 4 cols
            </Text>
          </Box>
        ))}
      </Grid>
    </VStack>
  ),
};

export const ResponsiveStack: Story = {
  render: () => (
    <VStack gap={4} p={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Stack Responsivo</Text>
      <HStack
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 2, md: 4, lg: 6 }}
        align={{ base: 'stretch', md: 'center' }}
      >
        <Box
          flex={{ base: '1', md: '1', lg: '2' }}
          bg="success"
          color="success.fg"
          p={4}
          borderRadius="md"
        >
          Item 1 (flex: base=1, lg=2)
        </Box>
        <Box
          flex="1"
          bg="info"
          color="info.fg"
          p={4}
          borderRadius="md"
        >
          Item 2 (flex: 1)
        </Box>
        <Box
          flex="1"
          bg="warning"
          color="warning.fg"
          p={4}
          borderRadius="md"
        >
          Item 3 (flex: 1)
        </Box>
      </HStack>
    </VStack>
  ),
};

export const ResponsiveVisibility: Story = {
  render: () => (
    <VStack gap={4} p={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Visibilidade Responsiva</Text>

      <Box
        bg="brand.500"
        color="white"
        p={4}
        borderRadius="md"
        display={{ base: 'block', md: 'none' }}
      >
        Visível apenas em mobile (base)
      </Box>

      <Box
        bg="success"
        color="success.fg"
        p={4}
        borderRadius="md"
        display={{ base: 'none', md: 'block', lg: 'none' }}
      >
        Visível apenas em tablet (md)
      </Box>

      <Box
        bg="info"
        color="info.fg"
        p={4}
        borderRadius="md"
        display={{ base: 'none', lg: 'block' }}
      >
        Visível apenas em desktop (lg+)
      </Box>
    </VStack>
  ),
};

export const ResponsiveText: Story = {
  render: () => (
    <VStack gap={4} p={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Tipografia Responsiva</Text>

      <Text
        fontSize={{ base: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}
        fontWeight={{ base: 'normal', md: 'medium', lg: 'semibold' }}
        lineHeight={{ base: 'tight', md: 'normal', lg: 'relaxed' }}
      >
        Texto que muda de tamanho, peso e line-height conforme o breakpoint
      </Text>

      <Text
        fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
        color="gray.600"
      >
        Texto menor e mais sutil em mobile
      </Text>
    </VStack>
  ),
};

export const ResponsiveSpacing: Story = {
  render: () => (
    <VStack gap={4} p={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">Espaçamento Responsivo</Text>

      <Box
        bg="gray.100"
        p={{ base: 2, md: 4, lg: 6, xl: 8 }}
        m={{ base: 2, md: 4, lg: 6 }}
        borderRadius="md"
      >
        <Text>
          Padding: base=8px, md=16px, lg=24px, xl=32px
          <br />
          Margin: base=8px, md=16px, lg=24px
        </Text>
      </Box>
    </VStack>
  ),
};

export const BreakpointReference: Story = {
  render: () => (
    <VStack gap={4} p={4} align="stretch" maxW="4xl" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Referência de Breakpoints
      </Text>

      <Box bg="card" p={6} borderRadius="lg" shadow="md">
        <VStack gap={3} align="stretch">
          <Box
            p={3}
            bg="brand.50"
            borderRadius="md"
            borderLeftWidth="4px"
            borderLeftColor="brand.500"
          >
            <Text fontWeight="bold" color="brand.700" mb={1}>
              base: 0em (0px)
            </Text>
            <Text fontSize="sm" color="gray.600">
              Mobile - Padrão para todos os dispositivos
            </Text>
          </Box>

          <Box
            p={3}
            bg="brand.50"
            borderRadius="md"
            borderLeftWidth="4px"
            borderLeftColor="brand.500"
          >
            <Text fontWeight="bold" color="brand.700" mb={1}>
              sm: 30em (480px)
            </Text>
            <Text fontSize="sm" color="gray.600">
              Small devices - Telefones grandes em landscape
            </Text>
          </Box>

          <Box
            p={3}
            bg="brand.50"
            borderRadius="md"
            borderLeftWidth="4px"
            borderLeftColor="brand.500"
          >
            <Text fontWeight="bold" color="brand.700" mb={1}>
              md: 48em (768px)
            </Text>
            <Text fontSize="sm" color="gray.600">
              Medium devices - Tablets
            </Text>
          </Box>

          <Box
            p={3}
            bg="brand.50"
            borderRadius="md"
            borderLeftWidth="4px"
            borderLeftColor="brand.500"
          >
            <Text fontWeight="bold" color="brand.700" mb={1}>
              lg: 62em (992px)
            </Text>
            <Text fontSize="sm" color="gray.600">
              Large devices - Desktop
            </Text>
          </Box>

          <Box
            p={3}
            bg="brand.50"
            borderRadius="md"
            borderLeftWidth="4px"
            borderLeftColor="brand.500"
          >
            <Text fontWeight="bold" color="brand.700" mb={1}>
              xl: 80em (1280px)
            </Text>
            <Text fontSize="sm" color="gray.600">
              Extra large devices - Large desktop
            </Text>
          </Box>

          <Box
            p={3}
            bg="brand.50"
            borderRadius="md"
            borderLeftWidth="4px"
            borderLeftColor="brand.500"
          >
            <Text fontWeight="bold" color="brand.700" mb={1}>
              2xl: 96em (1536px)
            </Text>
            <Text fontSize="sm" color="gray.600">
              2X Large devices - Extra large desktop
            </Text>
          </Box>
        </VStack>
      </Box>

      <Box bg="gray.50" p={4} borderRadius="md">
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          Exemplo de uso:
        </Text>
        <Box
          as="pre"
          bg="gray.900"
          color="gray.100"
          p={3}
          borderRadius="md"
          fontSize="xs"
          overflowX="auto"
        >
{`<Box
  p={{ base: 4, md: 6, lg: 8 }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
>
  Conteúdo responsivo
</Box>`}
        </Box>
      </Box>
    </VStack>
  ),
};
