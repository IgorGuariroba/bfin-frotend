import { useState, useEffect } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { SidebarCollapsed } from './SidebarCollapsed';
import { SidebarExpanded, MenuItem } from './SidebarExpanded';

interface SidebarProps {
  menuItems?: MenuItem[];
  onHomeClick: () => void;
  onSignOut: () => void;
  onVisibilityClick?: () => void;
  defaultExpanded?: boolean;
  accountInfo?: {
    agency: string;
    account: string;
    bank: string;
  };
  showQRCode?: boolean;
}

export function Sidebar({
  menuItems = [],
  onHomeClick,
  onSignOut,
  onVisibilityClick,
  defaultExpanded = false,
  accountInfo,
  showQRCode = true,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Close sidebar on mobile when window resizes
  useEffect(() => {
    if (isMobile && isExpanded) {
      setIsExpanded(false);
    }
  }, [isMobile, isExpanded]);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHomeClick = () => {
    onHomeClick();
    // Close expanded sidebar on mobile when navigating home
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const handleBackdropClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const handleMenuItemClick = (originalClick?: () => void) => {
    return () => {
      originalClick?.();
      // Close sidebar on mobile after menu item click
      if (isMobile) {
        setIsExpanded(false);
      }
    };
  };

  // Wrap menu items to auto-close on mobile
  const wrappedMenuItems = menuItems.map((item) => ({
    ...item,
    onClick: handleMenuItemClick(item.onClick),
  }));

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
          bg="blackAlpha.600"
          zIndex={19}
          onClick={handleBackdropClick}
          css={{
            animation: 'fadeIn 0.2s ease-out forwards',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          }}
        />
      )}

      {/* Sidebar Container */}
      <Box position="relative" display="flex">
        {/* Collapsed Sidebar */}
        <SidebarCollapsed
          isExpanded={isExpanded}
          onToggleExpanded={handleToggleExpanded}
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
    </>
  );
}