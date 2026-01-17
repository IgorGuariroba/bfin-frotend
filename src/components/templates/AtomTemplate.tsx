import { chakra, HTMLChakraProps } from '@chakra-ui/react';

export type AtomTemplateProps = HTMLChakraProps<'div'>;

/**
 * AtomTemplate - Basic component extending Chakra UI
 */
export function AtomTemplate(props: AtomTemplateProps) {
  return (
    <chakra.div colorPalette="brand" {...props} />
  );
}
