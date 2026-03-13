import type { Preview } from '@storybook/react-vite';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '../src/theme/theme';
import { ColorModeProvider } from '../src/components/ui/color-mode';
import '../src/index.css';

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  a11y: {
    test: 'todo'
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: 'var(--background)',
      },
      {
        name: 'dark',
        value: 'var(--background)',
      },
    ],
  },
};

export const decorators = [
  (Story) => (
    <ChakraProvider value={system}>
      <Story />
    </ChakraProvider>
  ),
];

const preview: Preview = {
  parameters,
  decorators,
};

export default preview;
