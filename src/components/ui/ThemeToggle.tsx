import {
  IconButton,
  Button,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { useColorMode } from '../../hooks/useColorMode';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({
  variant = 'icon',
  size = 'md',
  showLabel = false,
}: ThemeToggleProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const ariaLabel = isDark
    ? 'Mudar para modo claro'
    : 'Mudar para modo escuro';
  const tooltipLabel = isDark
    ? 'Mudar para modo claro'
    : 'Mudar para modo escuro';

  // Variant: Icon Button (compact, for headers)
  if (variant === 'icon') {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            aria-label={ariaLabel}
            onClick={toggleColorMode}
            variant="ghost"
            size={size}
            color={{ base: 'gray.700', _dark: 'gray.200' }}
            _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
            border="none"
            _focus={{ boxShadow: 'none' }}
          >
            <Icon as={isDark ? Sun : Moon} boxSize={size === 'sm' ? 4 : 5} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>{tooltipLabel}</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    );
  }

  // Variant: Button (with label, for styleguide)
  return (
    <Button
      variant="outline"
      onClick={toggleColorMode}
      size={size}
      borderRadius="full"
      borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
      color={{ base: 'gray.700', _dark: 'gray.200' }}
      _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
    >
      <Icon as={isDark ? Sun : Moon} boxSize={4} /> {showLabel && (isDark ? 'Modo Claro' : 'Modo Escuro')}
    </Button>
  );
}
