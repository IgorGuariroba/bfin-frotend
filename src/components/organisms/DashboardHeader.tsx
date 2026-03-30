import {
  Flex,
  Text,
  HStack,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { X, User, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileHeaderControls } from '../molecules';
import { customShadows } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { Menu } from '../ui/Menu';
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
  const { user } = useAuth();

  return (
    <Flex
      as="header"
      bg="var(--primary)"
      px={{ base: 4, md: 6 }}
      py={3}
      align="center"
      justify="space-between"
      boxShadow={customShadows.whiteGlow.sm}
      data-testid="dashboard-header"
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

        {/* Menu do usuário */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <HStack
              as="button"
              gap={2}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              data-testid="user-menu"
            >
              <Box
                w={8}
                h={8}
                borderRadius="full"
                bg="var(--primary-foreground)"
                color="var(--primary)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="sm"
                fontWeight="bold"
                data-testid="user-avatar"
              >
                {(user?.email || 'U')[0].toUpperCase()}
              </Box>
              <Box display={{ base: 'none', md: 'block' }}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="var(--primary-foreground)"
                  data-testid="user-name"
                >
                  {user?.email || 'Usuário Teste'}
                </Text>
              </Box>
            </HStack>
          </Menu.Trigger>
          <Menu.Content data-testid="user-menu-dropdown">
            <Menu.Item
              value="profile"
              data-testid="profile-option"
            >
              <User size={16} />
              <Text ml={2}>Perfil</Text>
            </Menu.Item>
            <Menu.Item
              value="settings"
              data-testid="settings-option"
            >
              <Settings size={16} />
              <Text ml={2}>Configurações</Text>
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item
              value="logout"
              onClick={onSignOut}
              data-testid="logout-option"
            >
              <LogOut size={16} />
              <Text ml={2}>Sair</Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>

        <IconButton
          aria-label="Sair da aplicação"
          size="sm"
          variant="ghost"
          color="var(--primary-foreground)"
          _hover={{ bg: 'whiteAlpha.100' }}
          onClick={onSignOut}
          border="none"
          _focus={{ boxShadow: 'none' }}
          display={{ base: 'flex', md: 'none' }}
        >
          <X size={16} />
        </IconButton>
      </HStack>
    </Flex>
  );
}