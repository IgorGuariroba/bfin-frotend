import {
  Box,
  VStack,
  HStack,
  Flex,
  Text,
  Button,
  Icon,
  Separator,
} from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface AccountInfo {
  agency: string;
  account: string;
  bank: string;
}

interface SidebarExpandedProps {
  isVisible: boolean;
  accountInfo?: AccountInfo;
  menuItems?: MenuItem[];
  onSignOut: () => void;
  showQRCode?: boolean;
}

export function SidebarExpanded({
  isVisible,
  accountInfo = {
    agency: '0001',
    account: '1000001-0',
    bank: '260 - BFIN Pagamentos S.A.',
  },
  menuItems = [],
  onSignOut,
  showQRCode = true,
}: SidebarExpandedProps) {
  if (!isVisible) return null;

  return (
    <Box
      position="absolute"
      left={{ base: "60px", md: "80px" }}
      top="0"
      bottom="0"
      w={{ base: "280px", md: "320px" }}
      bg="var(--primary)"
      zIndex={20}
      boxShadow="2xl"
      overflowY="auto"
      css={{
        animation: 'slideIn 0.3s ease-out forwards',
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
      }}
    >
      <VStack p={{ base: 4, md: 6 }} gap={{ base: 4, md: 6 }} align="stretch">
        {/* QR Code and Account Info */}
        {showQRCode && (
          <VStack gap={4} align="stretch">
            <Flex justify="center">
              <Box
                w={{ base: "160px", md: "180px" }}
                h={{ base: "160px", md: "180px" }}
                bg="card"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" color="muted.fg">QR Code</Text>
              </Box>
            </Flex>

            <VStack
              align="flex-start"
              gap={0}
              fontSize={{ base: "xs", md: "xs" }}
              color="var(--primary-foreground)"
              opacity={0.8}
            >
              <Text>Agência: {accountInfo.agency}</Text>
              <Text>Conta: {accountInfo.account}</Text>
              <Text>{accountInfo.bank}</Text>
            </VStack>
          </VStack>
        )}

        {showQRCode && menuItems.length > 0 && (
          <Separator borderColor="whiteAlpha.200" />
        )}

        {/* Menu Options */}
        {menuItems.length > 0 && (
          <VStack gap={2} align="stretch">
            {menuItems.map(({ id, icon, label, onClick, disabled = false }) => (
              <Button
                key={id}
                variant="ghost"
                color="var(--primary-foreground)"
                justifyContent="space-between"
                _hover={{ bg: 'whiteAlpha.100' }}
                _active={{ bg: 'whiteAlpha.200' }}
                _disabled={{
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  _hover: { bg: 'transparent' }
                }}
                size={{ base: "md", md: "lg" }}
                onClick={onClick}
                disabled={disabled}
                transition="all 0.2s"
              >
                <HStack>
                  <Icon as={icon} boxSize={5} />
                  <Text fontSize={{ base: "sm", md: "md" }}>{label}</Text>
                </HStack>
                <Text>›</Text>
              </Button>
            ))}
          </VStack>
        )}

        <Box flex="1" />

        {/* Disconnect Button */}
        <Button
          variant="solid"
          bg="transparent"
          color="var(--primary-foreground)"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
          _hover={{ bg: 'whiteAlpha.100' }}
          _active={{ bg: 'whiteAlpha.200', transform: 'scale(0.98)' }}
          size={{ base: "md", md: "lg" }}
          onClick={onSignOut}
          transition="all 0.2s"
          fontWeight="bold"
        >
          DESCONECTAR
        </Button>
      </VStack>
    </Box>
  );
}