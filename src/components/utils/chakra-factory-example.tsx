/**
 * Exemplo Prático: Usando Chakra Factory
 *
 * Este arquivo demonstra como usar o Chakra Factory em componentes reais
 */

import { chakra } from '@chakra-ui/react';
import { VStack, HStack } from '@chakra-ui/react';

// Exemplo 1: Card customizado com estilos base
export const Card = chakra('div', {
  baseStyle: {
    bg: 'card',
    color: 'card.fg',
    borderRadius: 'lg',
    p: 6,
    shadow: 'md',
  },
});

// Exemplo 2: Container responsivo
export const Container = chakra('div', {
  baseStyle: {
    maxW: 'container.xl',
    mx: 'auto',
    px: { base: 4, md: 6, lg: 8 },
  },
});

// Exemplo 3: Badge customizado
export const Badge = chakra('span', {
  baseStyle: {
    display: 'inline-block',
    px: 2,
    py: 1,
    borderRadius: 'md',
    fontSize: 'sm',
    fontWeight: 'semibold',
  },
});

// Exemplo 4: Section semântica
export const Section = chakra('section', {
  baseStyle: {
    py: { base: 8, md: 12, lg: 16 },
  },
});

// Exemplo 5: Article semântico
export const Article = chakra('article', {
  baseStyle: {
    maxW: '3xl',
    mx: 'auto',
  },
});

// Exemplo 6: Header customizado
export const Header = chakra('header', {
  baseStyle: {
    bg: 'bg',
    borderBottomWidth: '1px',
    borderColor: 'border',
    py: 4,
    px: { base: 4, md: 6 },
  },
});

// Exemplo 7: Footer customizado
export const Footer = chakra('footer', {
  baseStyle: {
    bg: 'muted',
    color: 'muted.fg',
    py: 8,
    px: { base: 4, md: 6 },
    mt: 'auto',
  },
});

// Exemplo 8: Nav customizado
export const Nav = chakra('nav', {
  baseStyle: {
    display: 'flex',
    gap: 4,
  },
});

// Exemplo 9: Main content area
export const Main = chakra('main', {
  baseStyle: {
    flex: 1,
    minH: '100vh',
  },
});

// Exemplo 10: Aside sidebar
export const Aside = chakra('aside', {
  baseStyle: {
    w: { base: 'full', md: '64' },
    bg: 'card',
    borderRightWidth: { base: 0, md: '1px' },
    borderColor: 'border',
  },
});

// Exemplo de uso em componente
export function ExampleUsage() {
  return (
    <Container>
      <Header>
        <HStack justify="space-between">
          <chakra.h1 fontSize="2xl" fontWeight="bold">
            Logo
          </chakra.h1>
          <Nav>
            <chakra.a href="#" _hover={{ color: 'brand.500' }}>
              Home
            </chakra.a>
            <chakra.a href="#" _hover={{ color: 'brand.500' }}>
              About
            </chakra.a>
          </Nav>
        </HStack>
      </Header>

      <Main>
        <Section>
          <Article>
            <Card>
              <chakra.h2 fontSize="xl" fontWeight="bold" mb={4}>
                Título do Card
              </chakra.h2>
              <chakra.p mb={4}>
                Este é um exemplo de uso do Chakra Factory em componentes reais.
              </chakra.p>
              <HStack gap={2}>
                <Badge bg="brand.500" color="white">
                  Novo
                </Badge>
                <Badge bg="success" color="success.fg">
                  Ativo
                </Badge>
              </HStack>
            </Card>
          </Article>
        </Section>
      </Main>

      <Footer>
        <chakra.p textAlign="center">
          © 2024 BFIN. Todos os direitos reservados.
        </chakra.p>
      </Footer>
    </Container>
  );
}
