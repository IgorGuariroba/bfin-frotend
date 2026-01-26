import {
  IconButton,
  Button,
  Icon,
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

  // Variant: Icon Button (compact, for headers)
  if (variant === 'icon') {
    return (
      <IconButton
        aria-label={ariaLabel}
        onClick={toggleColorMode}
        variant="outline"
        size={size}
        bg="secondary"
        color="fg"
        borderColor="border"
        _hover={{ bg: 'accent' }}
        _active={{ bg: 'secondary' }}
        _focusVisible={{
          outline: '2px solid var(--ring)',
          outlineOffset: '2px',
          boxShadow: 'var(--shadow-green-sm)',
        }}
        _disabled={{
          bg: 'accent',
          color: 'fg.muted',
          borderColor: 'border.subtle',
          cursor: 'not-allowed',
        }}
        borderRadius="md"
      >
        <Icon as={isDark ? Sun : Moon} boxSize={size === 'sm' ? 4 : 5} />
      </IconButton>
    );
  }

  // Variant: Button (with label, for styleguide)
  return (
    <Button
      variant="outline"
      onClick={toggleColorMode}
      size={size}
      borderRadius="full"
      bg="secondary"
      color="fg"
      borderColor="border"
      _hover={{ bg: 'accent' }}
      _active={{ bg: 'secondary' }}
      _focusVisible={{
        outline: '2px solid var(--ring)',
        outlineOffset: '2px',
        boxShadow: 'var(--shadow-green-sm)',
      }}
      _disabled={{
        bg: 'accent',
        color: 'fg.muted',
        borderColor: 'border.subtle',
        cursor: 'not-allowed',
      }}
    >
      <Icon as={isDark ? Sun : Moon} boxSize={4} /> {showLabel && (isDark ? 'Modo Claro' : 'Modo Escuro')}
    </Button>
  );
}
