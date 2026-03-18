import {
  Flex,
  Text,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileHeaderControls } from '../molecules';
import { customShadows } from '../../theme';
import type { SidebarState } from './index';

/**
 * Interface para props do DashboardHeader
 */
interface DashboardHeaderProps {
  sidebarState: SidebarState;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  onSignOut: () => void;
}


/**
 * Componente Header do Dashboard
 * Responsabilidade única: cabeçalho com branding, controles e navegação
 * Benefícios Clean Code:
 * - Single Responsibility: apenas UI do header
 * - Small Function: componente focado e pequeno
 * - Descriptive Names: props e funções bem nomeadas
 * - No Side Effects: apenas apresentação
 */
export function DashboardHeader({
  sidebarState,
  onToggleSidebar,
  onHomeClick,
  onSignOut,
}: DashboardHeaderProps) {

  return (
    <Flex
      as="header"
      bg="var(--primary)"
      px={{ base: 4, md: 6 }}
      py={3}
      align="center"
      justify="space-between"
      boxShadow={customShadows.whiteGlow.sm}
    >
      {/* Brand */}
      <Flex align="center" gap={3} minW={0}>
        {/* Controles móveis */}
        <MobileHeaderControls
          sidebarState={sidebarState}
          onToggleSidebar={onToggleSidebar}
        />

        {/* Branding - Home Button */}
        <Text
          as="button"
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="extrabold"
          color="var(--primary-foreground)"
          fontFamily="'Playfair Display SC', serif"
          lineHeight="shorter"
          cursor="pointer"
          _hover={{ opacity: 0.8, transform: 'scale(1.02)' }}
          _active={{ transform: 'scale(0.98)' }}
          transition="all 0.2s"
          onClick={onHomeClick}
          aria-label="Ir para home"
        >
          BFIN
        </Text>
      </Flex>

      {/* Controles da direita */}
      <HStack gap={{ base: 1, md: 2 }}>
        <ThemeToggle variant="icon" size="md" />

        <IconButton
          aria-label="Sair da aplicação"
          size="sm"
          variant="ghost"
          color="var(--primary-foreground)"
          _hover={{ bg: 'whiteAlpha.100' }}
          onClick={onSignOut}
          border="none"
          _focus={{ boxShadow: 'none' }}
        >
          <X size={16} />
        </IconButton>
      </HStack>
    </Flex>
  );
}