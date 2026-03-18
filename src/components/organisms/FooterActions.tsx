import { Box, Flex, Text } from '@chakra-ui/react';
import {
  Home,
  BarChart3,
  Users,
  Send,
  Download,
  DollarSign,
  Sliders,
} from 'lucide-react';
import { customShadows } from '../../theme';
import type { ExpandedFormType } from '../../types/ExpandedForms';

interface FooterActionsProps {
  expandedForm: ExpandedFormType;
  onFormSelect: (form: ExpandedFormType) => void;
  onHomeClick: () => void;
}

export function FooterActions({ expandedForm, onFormSelect, onHomeClick }: FooterActionsProps) {
  const footerActions = [
    {
      key: 'home' as const,
      icon: Home,
      label: 'Home',
    },
    {
      key: 'pagar' as const,
      icon: BarChart3,
      label: 'Pagar',
    },
    {
      key: 'bfin-parceiro' as const,
      icon: Users,
      label: 'Bfin Parceiro',
    },
    {
      key: 'transferir' as const,
      icon: Send,
      label: 'Transferir',
    },
    {
      key: 'depositar' as const,
      icon: Download,
      label: 'Depositar',
    },
    {
      key: 'emprestimos' as const,
      icon: DollarSign,
      label: 'Empréstimos',
    },
    {
      key: 'ajustar-limite' as const,
      icon: Sliders,
      label: 'Ajustar limite',
    },
  ];

  const handleActionClick = (actionKey: string) => {
    if (actionKey === 'home') {
      onHomeClick();
    } else {
      onFormSelect(expandedForm === actionKey ? null : actionKey as ExpandedFormType);
    }
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="var(--primary)"
      boxShadow={customShadows.whiteGlow.top}
      px={{ base: 4, md: 8 }}
      py={{ base: 3, md: 2 }}
      zIndex={15}
    >
      <Flex
        gap={{ base: 3, md: 2 }}
        align="stretch" // Isso faz todos os itens terem a mesma altura
        justify={{ base: "flex-start", md: "space-between" }}
        overflowX={{ base: "auto", md: "visible" }}
        pb={{ base: 2, md: 0 }}
        css={{
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      >
        {footerActions.map(({ key, icon: IconComponent, label }) => (
          <Box
            key={key}
            flex={{ base: "0 0 80px", md: "1" }}
            minW={{ base: "80px", md: "0" }}
            borderRadius={{ base: "lg", md: "xl" }}
            bg="whiteAlpha.200"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            _hover={{ bg: 'whiteAlpha.300' }}
            _active={{ bg: 'whiteAlpha.400', transform: 'scale(0.95)' }}
            transition="all 0.2s"
            onClick={() => handleActionClick(key)}
            gap={{ base: 1.5, md: 1 }}
            px={{ base: 2, md: 2 }}
            py={{ base: 2, md: 5}}
          >
            <IconComponent
              size={24}
              color="var(--primary-foreground)"
              style={{ flexShrink: 0 }}
            />
            <Text
              color="var(--primary-foreground)"
              fontSize={{ base: "xs", md: "2xs" }}
              fontWeight="medium"
              textAlign="center"
              lineHeight="1.2"
              overflow="hidden"
              css={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
              }}
            >
              {label}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
