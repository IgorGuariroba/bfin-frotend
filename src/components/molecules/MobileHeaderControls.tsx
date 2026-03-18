import { HStack, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { Menu } from 'lucide-react';
import { SidebarState } from '../../types/sidebar';

interface MobileHeaderControlsProps {
  sidebarState: SidebarState;
  onToggleSidebar: () => void;
}

export function MobileHeaderControls({
  sidebarState,
  onToggleSidebar,
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

    </HStack>
  );
}