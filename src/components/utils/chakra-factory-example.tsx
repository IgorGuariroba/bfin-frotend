/**
 * Exemplo Prático: Usando Chakra Factory no Chakra UI v3
 *
 * Em Chakra v3, chakra() é usado sem configuração de estilos base.
 * Os estilos são aplicados diretamente como props ao usar o componente.
 */

import { chakra } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';

// Exemplos básicos de componentes com chakra factory
export const Card = chakra('div');
export const Container = chakra('div');
export const FlexContainer = chakra('div');
export const GridContainer = chakra('div');
export const Badge = chakra('span');
export const Pill = chakra('span');
export const StyledSection = chakra('section');
export const Article = chakra('article');
export const NavBar = chakra('nav');
export const Footer = chakra('footer');

// Exemplo de uso:
export const ExampleUsage = () => (
  <Container maxW="container.xl" mx="auto" px={4}>
    <Card bg="card" color="card.fg" borderRadius="lg" p={6} shadow="md">
      <HStack gap={4}>
        <Badge bg="brand.solid" color="white" px={3} py={1} borderRadius="full">
          Novo
        </Badge>
        <span>Conteúdo do card</span>
      </HStack>
    </Card>
  </Container>
);
