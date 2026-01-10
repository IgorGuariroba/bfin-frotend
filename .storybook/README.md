# Storybook - BFIN Design System

Este projeto usa Storybook para documentar e testar os componentes do design system.

## Comandos

### Desenvolvimento
```bash
npm run storybook
```
Abre o Storybook em modo de desenvolvimento na porta 6006.

### Build
```bash
npm run build-storybook
```
Gera uma versão estática do Storybook para deploy.

## Estrutura

As stories estão organizadas seguindo a estrutura de componentes:

- **Atoms/** - Componentes básicos (Button, Input, etc.)
- **Molecules/** - Componentes compostos (FormField, FormSelect, etc.)
- **Components/** - Componentes do Chakra UI (Card, Alert, etc.)

## Configuração

O Storybook está configurado para:
- ✅ Suporte completo ao Chakra UI v3
- ✅ Integração com Vite
- ✅ Suporte a TypeScript
- ✅ Autodocs habilitado
- ✅ Testes de acessibilidade (a11y)
- ✅ Suporte a temas claro/escuro

## Adicionando novas Stories

Crie um arquivo `.stories.tsx` ao lado do componente:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MeuComponente } from './MeuComponente';

const meta = {
  title: 'Categoria/MeuComponente',
  component: MeuComponente,
  tags: ['autodocs'],
} satisfies Meta<typeof MeuComponente>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props do componente
  },
};
```

## Recursos

- **Autodocs**: Documentação automática gerada a partir dos componentes
- **Controls**: Controles interativos para testar props
- **A11y**: Testes de acessibilidade integrados
- **Viewport**: Teste em diferentes tamanhos de tela
