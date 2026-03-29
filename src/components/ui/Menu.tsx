import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, HStack } from '@chakra-ui/react';

// Simple Menu implementation for the user dropdown
interface MenuRootProps {
  children: React.ReactNode;
}

interface MenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface MenuContentProps {
  children: React.ReactNode;
  'data-testid'?: string;
}

interface MenuItemProps {
  value: string;
  onClick?: () => void;
  children: React.ReactNode;
  'data-testid'?: string;
}

interface MenuSeparatorProps {
  className?: string;
}

const MenuContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

const MenuRoot: React.FC<MenuRootProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      <Box position="relative">
        {children}
      </Box>
    </MenuContext.Provider>
  );
};

const MenuTrigger: React.FC<MenuTriggerProps> = ({ asChild, children }) => {
  const { isOpen, setIsOpen } = React.useContext(MenuContext);

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setIsOpen(!isOpen)
    });
  }

  return (
    <Box as="button" onClick={() => setIsOpen(!isOpen)}>
      {children}
    </Box>
  );
};

const MenuContent: React.FC<MenuContentProps> = ({ children, 'data-testid': dataTestId }) => {
  const { isOpen, setIsOpen } = React.useContext(MenuContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <Box
      ref={contentRef}
      position="absolute"
      top="100%"
      right={0}
      mt={1}
      bg="var(--card)"
      border="1px solid var(--border)"
      borderRadius="md"
      shadow="lg"
      minW="200px"
      zIndex={1000}
      data-testid={dataTestId}
    >
      <VStack gap={0} align="stretch" p={1}>
        {children}
      </VStack>
    </Box>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ value: _value, onClick, children, 'data-testid': dataTestId }) => {
  const { setIsOpen } = React.useContext(MenuContext);

  const handleClick = () => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <HStack
      as="button"
      gap={2}
      p={2}
      borderRadius="sm"
      cursor="pointer"
      _hover={{ bg: 'var(--muted)' }}
      onClick={handleClick}
      textAlign="left"
      data-testid={dataTestId}
    >
      {children}
    </HStack>
  );
};

const MenuSeparator: React.FC<MenuSeparatorProps> = ({ className }) => {
  return <Box h="1px" bg="var(--border)" mx={2} my={1} className={className} />;
};

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
};