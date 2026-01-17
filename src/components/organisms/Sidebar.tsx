import { useState, useEffect, useCallback } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { SidebarCollapsed } from './SidebarCollapsed';
import { SidebarExpanded, MenuItem } from './SidebarExpanded';
import { SidebarState, defaultSidebarConfig } from '../../types/sidebar';

interface SidebarProps {
  menuItems?: MenuItem[];
  onHomeClick: () => void;
  onSignOut: () => void;
  onVisibilityClick?: () => void;
  onToggleSidebar?: (state: SidebarState) => void; // Callback para comunicar mudanças de estado
  toggleRef?: React.MutableRefObject<(() => void) | null>; // Ref para controle externo
  accountInfo?: {
    agency: string;
    account: string;
    bank: string;
  };
  showQRCode?: boolean;
  // Configuração de comportamento
  hiddenOnMobile?: boolean;
  defaultMobileState?: SidebarState;
  defaultDesktopState?: SidebarState;
}

export function Sidebar({
  menuItems = [],
  onHomeClick,
  onSignOut,
  onVisibilityClick,
  onToggleSidebar,
  toggleRef,
  accountInfo,
  showQRCode = true,
  hiddenOnMobile = true,
  defaultMobileState = 'hidden',
  defaultDesktopState = 'collapsed',
}: SidebarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Estado inicial baseado no viewport
  const getInitialState = (): SidebarState => {
    if (isMobile) {
      return hiddenOnMobile ? defaultMobileState : 'collapsed';
    }
    return defaultDesktopState;
  };

  const [sidebarState, setSidebarState] = useState<SidebarState>(getInitialState);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile && hiddenOnMobile) {
      // Mobile: hidden <-> expanded
      setSidebarState(sidebarState === 'hidden' ? 'expanded' : 'hidden');
    } else {
      // Desktop: collapsed <-> expanded
      setSidebarState(sidebarState === 'expanded' ? 'collapsed' : 'expanded');
    }
  }, [isMobile, hiddenOnMobile, sidebarState]);

  // Atualizar estado quando mudar de desktop para mobile (só mudança de viewport)
  useEffect(() => {
    if (isMobile && hiddenOnMobile && sidebarState !== 'hidden') {
      setSidebarState('hidden');
    } else if (!isMobile && sidebarState === 'hidden') {
      setSidebarState('collapsed');
    }
  }, [isMobile, hiddenOnMobile]); // eslint-disable-line react-hooks/exhaustive-deps
  // Nota: sidebarState foi intencionalmente removido das dependências para evitar loops infinitos

  // Notificar mudanças de estado
  useEffect(() => {
    onToggleSidebar?.(sidebarState);
  }, [sidebarState, onToggleSidebar]);

  // Expor função de toggle via ref para controle externo
  useEffect(() => {
    if (toggleRef) {
      toggleRef.current = handleToggleSidebar;
    }
  }, [toggleRef, handleToggleSidebar]);

  const handleHomeClick = () => {
    onHomeClick();
    // Fechar sidebar expandida no mobile
    if (isMobile && sidebarState === 'expanded') {
      setSidebarState(hiddenOnMobile ? 'hidden' : 'collapsed');
    }
  };

  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarState(hiddenOnMobile ? 'hidden' : 'collapsed');
    }
  };

  const handleMenuItemClick = (originalClick?: () => void) => {
    return () => {
      originalClick?.();
      // Fechar sidebar no mobile após clique em item
      if (isMobile && sidebarState === 'expanded') {
        setSidebarState(hiddenOnMobile ? 'hidden' : 'collapsed');
      }
    };
  };

  // Wrap menu items to auto-close on mobile
  const wrappedMenuItems = menuItems.map((item) => ({
    ...item,
    onClick: handleMenuItemClick(item.onClick),
  }));

  const isExpanded = sidebarState === 'expanded';
  const isVisible = sidebarState !== 'hidden';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isExpanded && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={`blackAlpha.${Math.round(defaultSidebarConfig.backdropOpacity * 100)}`}
          zIndex={19}
          onClick={handleBackdropClick}
          css={{
            animation: `fadeIn ${defaultSidebarConfig.slideAnimationDuration}ms ease-out forwards`,
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          }}
        />
      )}

      {/* Sidebar Container */}
      {isVisible && (
        <Box
          position="relative"
          display="flex"
          css={isMobile && hiddenOnMobile ? {
            // No mobile com modo hidden, sidebar desliza da lateral
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 20,
            animation: `slideIn ${defaultSidebarConfig.slideAnimationDuration}ms ease-out forwards`,
            '@keyframes slideIn': {
              '0%': {
                transform: 'translateX(-100%)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          } : undefined}
        >
          {/* Collapsed Sidebar */}
          <SidebarCollapsed
            isExpanded={isExpanded}
            onToggleExpanded={handleToggleSidebar}
            onHomeClick={handleHomeClick}
            onVisibilityClick={onVisibilityClick}
          />

          {/* Expanded Sidebar */}
          <SidebarExpanded
            isVisible={isExpanded}
            accountInfo={accountInfo}
            menuItems={wrappedMenuItems}
            onSignOut={onSignOut}
            showQRCode={showQRCode}
          />
        </Box>
      )}
    </>
  );
}