import type { Meta, StoryObj } from '@storybook/react';
import { Card, Heading, Text, Button, VStack } from '@chakra-ui/react';

const meta = {
  title: 'Components/Card',
  component: Card.Root,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card.Root maxW="400px">
      <Card.Header>
        <Heading size="md">Card Title</Heading>
      </Card.Header>
      <Card.Body>
        <Text>
          Este é um exemplo de card básico com título e conteúdo.
        </Text>
      </Card.Body>
    </Card.Root>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card.Root maxW="400px">
      <Card.Header>
        <Heading size="md">Card com Footer</Heading>
      </Card.Header>
      <Card.Body>
        <Text>
          Este card inclui um footer com ações.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="outline" size="sm">Cancelar</Button>
        <Button size="sm" ml={2}>Confirmar</Button>
      </Card.Footer>
    </Card.Root>
  ),
};

export const WithShadow: Story = {
  render: () => (
    <VStack gap={4} align="stretch">
      <Card.Root maxW="400px" shadow="sm">
        <Card.Body>
          <Text>Shadow Small</Text>
        </Card.Body>
      </Card.Root>
      <Card.Root maxW="400px" shadow="md">
        <Card.Body>
          <Text>Shadow Medium</Text>
        </Card.Body>
      </Card.Root>
      <Card.Root maxW="400px" shadow="lg">
        <Card.Body>
          <Text>Shadow Large</Text>
        </Card.Body>
      </Card.Root>
      <Card.Root maxW="400px" shadow="xl">
        <Card.Body>
          <Text>Shadow Extra Large</Text>
        </Card.Body>
      </Card.Root>
    </VStack>
  ),
};

export const Bordered: Story = {
  render: () => (
    <Card.Root maxW="400px" borderWidth="1px" borderColor="gray.200">
      <Card.Header>
        <Heading size="md">Card com Borda</Heading>
      </Card.Header>
      <Card.Body>
        <Text>
          Este card tem uma borda visível.
        </Text>
      </Card.Body>
    </Card.Root>
  ),
};
