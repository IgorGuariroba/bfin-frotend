import { Box, Text } from '@chakra-ui/react';

interface ApiErrorBoxProps {
  error: unknown;
}

export function ApiErrorBox({ error }: ApiErrorBoxProps) {
  return (
    <Box
      bg={{ base: 'red.50', _dark: 'red.950' }}
      borderWidth="1px"
      borderColor={{ base: 'red.200', _dark: 'red.800' }}
      borderRadius="lg"
      p={4}
    >
      <Text fontSize="sm" color={{ base: 'red.600', _dark: 'red.300' }}>
        {error instanceof Error ? error.message : 'Erro ao criar despesa'}
      </Text>
    </Box>
  );
}