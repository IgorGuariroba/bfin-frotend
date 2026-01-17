import { HStack, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { Menu, Home } from 'lucide-react';
import { SidebarState } from '../../types/sidebar';

interface MobileHeaderControlsProps {
  sidebarState: SidebarState;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  showHomeButton?: boolean;
}

export function MobileHeaderControls({
  sidebarState,
  onToggleSidebar,
  onHomeClick,
  showHomeButton = true,
}: MobileHeaderControlsProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Só renderizar no mobile
  if (!isMobile) return null;

  return (
    <HStack gap={2}>
      {/* Botão Hambúrguer - para abrir/fechar sidebar */}
      <IconButton
        aria-label={sidebarState === 'hidden' ? 'Abrir menu' : 'Fechar menu'}
        variant="ghost"
        color="var(--primary-foreground)"
        _hover={{ bg: 'whiteAlpha.100' }}
        _active={{ bg: 'whiteAlpha.200', transform: 'scale(0.95)' }}
        size="md"
        border="none"
        _focus={{ boxShadow: 'none' }}
        onClick={onToggleSidebar}
        transition="all 0.2s"
        css={{
          transform: sidebarState === 'expanded' ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'all 0.3s ease',
        }}
      >
        <Menu size={20} />
      </IconButton>

      {/* Botão Home - sempre visível no mobile quando sidebar está oculta */}
      {showHomeButton && sidebarState === 'hidden' && (
        <IconButton
          aria-label="Home"
          variant="ghost"
          color="var(--primary-foreground)"
          _hover={{ bg: 'whiteAlpha.100' }}
          _active={{ bg: 'whiteAlpha.200', transform: 'scale(0.95)' }}
          size="md"
          border="none"
          _focus={{ boxShadow: 'none' }}
          onClick={onHomeClick}
          transition="all 0.2s"
        >
          <Home size={20} />
        </IconButton>
      )}
    </HStack>
  );
}