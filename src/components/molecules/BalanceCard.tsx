import { Card, Text } from '@chakra-ui/react';

interface BalanceCardProps {
  label: string;
  amount: number;
  variant?: 'available' | 'locked' | 'reserve' | 'total';
}

export function BalanceCard({ label, amount, variant = 'total' }: BalanceCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mapeia as variantes para as cores semânticas do tema
  const variantStyles = {
    available: {
      bg: { base: 'green.100', _dark: 'green.900/30' },
      text: { base: 'green.700', _dark: 'green.300' },
      borderColor: { base: 'green.200', _dark: 'green.700/50' }
    },
    locked: {
      bg: { base: 'blue.100', _dark: 'blue.900/30' },
      text: { base: 'blue.700', _dark: 'blue.300' },
      borderColor: { base: 'blue.200', _dark: 'blue.700/50' }
    },
    reserve: {
      bg: { base: 'yellow.100', _dark: 'yellow.900/30' },
      text: { base: 'yellow.700', _dark: 'yellow.400' },
      borderColor: { base: 'yellow.200', _dark: 'yellow.700/50' }
    },
    total: {
      bg: { base: 'brand.100', _dark: 'brand.950/40' },
      text: { base: 'brand.700', _dark: 'brand.300' },
      borderColor: { base: 'brand.200', _dark: 'brand.700/50' }
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card.Root
      flex="1"
      minW="140px"
      size="sm"
      borderWidth="1px"
      borderColor={styles.borderColor}
    >
      <Card.Body
        p={4}
        bg={styles.bg}
      >
        <Text
          fontSize="xs"
          color={{ base: 'muted.fg', _dark: 'muted.fg' }}
          mb={1.5}
          textTransform="uppercase"
          letterSpacing="wide"
          fontWeight="medium"
        >
          {label}
        </Text>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={styles.text}
          lineHeight="tight"
        >
          {formatCurrency(amount)}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
