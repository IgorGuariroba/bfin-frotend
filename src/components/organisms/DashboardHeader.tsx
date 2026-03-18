import {
  Flex,
  Text,
  VStack,
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
  userName?: string;
  sidebarState: SidebarState;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  onSignOut: () => void;
}

/**
 * Função utilitária para extrair primeiro nome
 */
function getFirstName(fullName?: string): string {
  if (!fullName) return 'Usuário';
  return fullName.split(' ')[0];
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
  userName,
  sidebarState,
  onToggleSidebar,
  onHomeClick,
  onSignOut,
}: DashboardHeaderProps) {
  const firstName = getFirstName(userName);

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
      {/* Brand e Saudação */}
      <Flex align="center" gap={3} minW={0}>
        {/* Controles móveis */}
        <MobileHeaderControls
          sidebarState={sidebarState}
          onToggleSidebar={onToggleSidebar}
          onHomeClick={onHomeClick}
          showHomeButton={true}
        />

        {/* Branding */}
        <VStack align="flex-start" gap={0} minW={0}>
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="extrabold"
            color="var(--primary-foreground)"
            fontFamily="'Playfair Display SC', serif"
            lineHeight="shorter"
          >
            BFIN
          </Text>

          {/* Saudação mobile */}
          <Text
            color="var(--primary-foreground)"
            fontSize="xs"
            display={{ base: 'block', md: 'none' }}
            lineClamp={1}
          >
            Olá, {firstName}
          </Text>
        </VStack>

        {/* Saudação desktop */}
        <Text
          color="var(--primary-foreground)"
          fontSize="sm"
          display={{ base: 'none', md: 'block' }}
        >
          - Olá, {firstName}
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