import type { Meta, StoryObj } from '@storybook/react';
import { VStack, HStack } from '@chakra-ui/react';
import {
  CustomDiv,
  CustomSection,
  NativeButton,
  NativeInput,
  StyledCard,
  StyledContainer,
  HighlightCard,
  StyledBadge,
  CustomSpan,
  CustomParagraph,
  CustomH1,
  CustomH2,
  CustomH3,
  CustomLink,
  CustomTable,
  CustomTr,
  CustomTd,
  CustomTh,
} from './chakra-factory';

const meta = {
  title: 'Utils/Chakra Factory',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <CustomDiv
        bg="brand.100"
        color="brand.900"
        p={4}
        borderRadius="md"
      >
        Custom Div com props do Chakra
      </CustomDiv>

      <CustomSection
        bg="gray.100"
        p={6}
        borderRadius="lg"
      >
        <CustomH2 fontSize="xl" fontWeight="bold" mb={2}>
          Seção Customizada
        </CustomH2>
        <CustomParagraph color="gray.700">
          Este é um parágrafo dentro de uma seção customizada usando Chakra Factory.
        </CustomParagraph>
      </CustomSection>
    </VStack>
  ),
};

export const NativeElements: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <NativeButton
        bg="brand.500"
        color="white"
        px={4}
        py={2}
        borderRadius="md"
        _hover={{ bg: 'brand.600' }}
        _active={{ bg: 'brand.700' }}
      >
        Botão HTML Nativo com Chakra Props
      </NativeButton>

      <NativeInput
        type="text"
        placeholder="Input HTML nativo com props do Chakra"
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="md"
        px={3}
        py={2}
        _focus={{ borderColor: 'brand.500', outline: 'none' }}
      />
    </VStack>
  ),
};

export const StyledComponents: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <StyledCard>
        <CustomH3 fontSize="lg" fontWeight="bold" mb={2}>
          Card Estilizado
        </CustomH3>
        <CustomParagraph>
          Este card usa estilos base definidos no Chakra Factory.
        </CustomParagraph>
      </StyledCard>

      <HighlightCard>
        <CustomH3 fontSize="lg" fontWeight="bold" mb={2}>
          Card de Destaque
        </CustomH3>
        <CustomParagraph>
          Card com estilo de destaque usando cores primárias.
        </CustomParagraph>
      </HighlightCard>

      <StyledContainer bg="gray.50" p={4} borderRadius="md">
        <CustomParagraph>
          Container estilizado com largura máxima e padding automático.
        </CustomParagraph>
      </StyledContainer>
    </VStack>
  ),
};

export const Typography: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <CustomH1 fontSize="3xl" fontWeight="bold" color="brand.700">
        Heading 1 Customizado
      </CustomH1>

      <CustomH2 fontSize="2xl" fontWeight="semibold" color="brand.600">
        Heading 2 Customizado
      </CustomH2>

      <CustomH3 fontSize="xl" fontWeight="medium" color="brand.500">
        Heading 3 Customizado
      </CustomH3>

      <CustomParagraph fontSize="md" lineHeight="relaxed" color="gray.700">
        Este é um parágrafo customizado usando Chakra Factory. Você pode usar todas as props de estilo do Chakra UI.
      </CustomParagraph>

      <CustomSpan
        bg="brand.100"
        color="brand.800"
        px={2}
        py={1}
        borderRadius="sm"
        fontSize="sm"
      >
        Span customizado com background
      </CustomSpan>
    </VStack>
  ),
};

export const Badges: Story = {
  render: () => (
    <HStack gap={2} flexWrap="wrap">
      <StyledBadge bg="brand.500" color="white">
        Brand
      </StyledBadge>
      <StyledBadge bg="success" color="success.fg">
        Success
      </StyledBadge>
      <StyledBadge bg="error" color="error.fg">
        Error
      </StyledBadge>
      <StyledBadge bg="warning" color="warning.fg">
        Warning
      </StyledBadge>
      <StyledBadge bg="info" color="info.fg">
        Info
      </StyledBadge>
    </HStack>
  ),
};

export const Table: Story = {
  render: () => (
    <CustomTable width="100%">
      <thead>
        <CustomTr bg="gray.100">
          <CustomTh p={3} textAlign="left">Nome</CustomTh>
          <CustomTh p={3} textAlign="left">Email</CustomTh>
          <CustomTh p={3} textAlign="right">Status</CustomTh>
        </CustomTr>
      </thead>
      <tbody>
        <CustomTr borderBottomWidth="1px" borderColor="gray.200">
          <CustomTd p={3}>João Silva</CustomTd>
          <CustomTd p={3}>joao@example.com</CustomTd>
          <CustomTd p={3} textAlign="right">
            <StyledBadge bg="success" color="success.fg">Ativo</StyledBadge>
          </CustomTd>
        </CustomTr>
        <CustomTr borderBottomWidth="1px" borderColor="gray.200">
          <CustomTd p={3}>Maria Santos</CustomTd>
          <CustomTd p={3}>maria@example.com</CustomTd>
          <CustomTd p={3} textAlign="right">
            <StyledBadge bg="warning" color="warning.fg">Pendente</StyledBadge>
          </CustomTd>
        </CustomTr>
        <CustomTr>
          <CustomTd p={3}>Pedro Costa</CustomTd>
          <CustomTd p={3}>pedro@example.com</CustomTd>
          <CustomTd p={3} textAlign="right">
            <StyledBadge bg="error" color="error.fg">Inativo</StyledBadge>
          </CustomTd>
        </CustomTr>
      </tbody>
    </CustomTable>
  ),
};

export const ResponsiveProps: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <CustomDiv
        bg="brand.500"
        color="white"
        p={{ base: 4, md: 6, lg: 8 }}
        fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
        borderRadius={{ base: 'md', md: 'lg', lg: 'xl' }}
      >
        Div responsivo com props do Chakra
      </CustomDiv>

      <CustomParagraph
        fontSize={{ base: 'sm', md: 'md' }}
        lineHeight={{ base: 'tight', md: 'normal' }}
      >
        Parágrafo com tamanhos de fonte e line-height responsivos.
      </CustomParagraph>
    </VStack>
  ),
};

export const PseudoStates: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <CustomLink
        href="#"
        color="brand.500"
        textDecoration="underline"
        _hover={{ color: 'brand.600', textDecoration: 'none' }}
        _active={{ color: 'brand.700' }}
      >
        Link com estados hover e active
      </CustomLink>

      <NativeButton
        bg="brand.500"
        color="white"
        px={6}
        py={3}
        borderRadius="md"
        _hover={{ bg: 'brand.600', transform: 'scale(1.05)' }}
        _active={{ bg: 'brand.700', transform: 'scale(0.95)' }}
        transition="all 0.2s"
      >
        Botão com animações
      </NativeButton>

      <CustomDiv
        bg="gray.100"
        p={4}
        borderRadius="md"
        cursor="pointer"
        _hover={{ bg: 'gray.200', shadow: 'md' }}
        _active={{ bg: 'gray.300' }}
        transition="all 0.2s"
      >
        Div clicável com estados
      </CustomDiv>
    </VStack>
  ),
};
