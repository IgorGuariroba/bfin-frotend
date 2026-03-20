import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export type ButtonProps = ChakraButtonProps;

export function Button({ colorPalette = 'brand', ...props }: ButtonProps) {
  return <ChakraButton colorPalette={colorPalette} {...props} />;
}
