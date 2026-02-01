import React from 'react';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import * as projectAnnotations from './preview';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '../src/theme/theme';
import '@testing-library/jest-dom/vitest';

// Inline decorators to ensure they are applied
const annotations = {
  ...projectAnnotations,
  decorators: [
    (Story: any) => (
      <ChakraProvider value={system}>
        <Story />
      </ChakraProvider>
    ),
  ]
};

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, annotations]);
