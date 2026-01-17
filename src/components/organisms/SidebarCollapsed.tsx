import { VStack, IconButton, Tooltip } from '@chakra-ui/react';
import { Home, Settings, Eye } from 'lucide-react';
import { customShadows } from '../../theme';

interface SidebarCollapsedProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onHomeClick: () => void;
  onVisibilityClick?: () => void;
}

export function SidebarCollapsed({
  isExpanded,
  onToggleExpanded,
  onHomeClick,
  onVisibilityClick,
}: SidebarCollapsedProps) {
  const sidebarItems = [
    {
      key: 'home',
      icon: Home,
      label: 'Home',
      ariaLabel: 'Home',
      onClick: onHomeClick,
    },
    {
      key: 'settings',
      icon: Settings,
      label: isExpanded ? 'Ocultar configurações' : 'Mostrar configurações',
      ariaLabel: 'Configurações',
      onClick: onToggleExpanded,
    },
    {
      key: 'visibility',
      icon: Eye,
      label: 'Visibilidade',
      ariaLabel: 'Visibilidade',
      onClick: onVisibilityClick,
    },
  ];

  return (
    <VStack
      w={{ base: "60px", md: "80px" }}
      bg="var(--primary)"
      py={{ base: 4, md: 6 }}
      gap={{ base: 4, md: 6 }}
      boxShadow={customShadows.whiteGlow.side}
      position="relative"
      zIndex={1}
      minH="100%"
    >
      {sidebarItems.map(({ key, icon: IconComponent, label, ariaLabel, onClick }) => (
        <Tooltip.Root key={key}>
          <Tooltip.Trigger asChild>
            <IconButton
              aria-label={ariaLabel}
              variant="ghost"
              color="var(--primary-foreground)"
              _hover={{ bg: 'whiteAlpha.100' }}
              _active={{ bg: 'whiteAlpha.200', transform: 'scale(0.95)' }}
              size={{ base: "md", md: "lg" }}
              border="none"
              _focus={{ boxShadow: 'none' }}
              onClick={onClick}
              transition="all 0.2s"
            >
              <IconComponent size={24} />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>{label}</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      ))}
    </VStack>
  );
}