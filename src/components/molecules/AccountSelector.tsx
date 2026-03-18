import { Box, HStack, VStack, Text, Menu } from '@chakra-ui/react';
import { ChevronDown, Check } from 'lucide-react';
import { iconColors } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import type { Account } from '../../hooks/useAccountSelection';

interface AccountSelectorProps {
  accounts: Account[];
  selectedAccount?: Account;
  onSelectAccount: (accountId: string) => void;
}

/**
 * Componente de seleção de conta com dropdown customizado
 */
export function AccountSelector({
  accounts,
  selectedAccount,
  onSelectAccount
}: AccountSelectorProps) {
  return (
    <Menu.Root positioning={{ placement: 'bottom-start', sameWidth: true }}>
      <Menu.Trigger asChild>
        <Box
          as="button"
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          py={3}
          mb={6}
          fontSize="md"
          fontWeight="medium"
          color="var(--card-foreground)"
          bg="var(--card)"
          borderWidth="1px"
          borderColor="var(--border)"
          borderRadius="lg"
          transition="all 0.2s"
          _hover={{
            borderColor: 'var(--primary)',
          }}
          _focus={{
            outline: 'none',
            borderColor: 'var(--primary)',
            boxShadow: '0 0 0 1px var(--primary)',
          }}
        >
          <Text>
            {selectedAccount ? selectedAccount.account_name : 'Selecione uma conta'}
          </Text>
          <ChevronDown size={20} />
        </Box>
      </Menu.Trigger>

      <Menu.Positioner>
        <Menu.Content
          maxH="300px"
          overflowY="auto"
          bg="var(--card)"
          borderRadius="lg"
          boxShadow="lg"
          borderWidth="1px"
          borderColor="var(--border)"
          p={1}
        >
          {accounts.map((account) => (
            <Menu.Item
              key={account.id}
              value={account.id}
              onClick={() => onSelectAccount(account.id)}
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              bg={selectedAccount?.id === account.id ? 'var(--muted)' : 'transparent'}
              _hover={{
                bg: 'var(--muted)',
              }}
            >
              <HStack justify="space-between" w="full">
                <VStack align="flex-start" gap={0}>
                  <Text fontWeight="medium" color="var(--card-foreground)">
                    {account.account_name}
                  </Text>
                  <Text fontSize="sm" color="var(--muted-foreground)">
                    {formatCurrency(Number(account.available_balance))}
                  </Text>
                </VStack>
                {selectedAccount?.id === account.id && (
                  <Check size={16} color={iconColors.success} />
                )}
              </HStack>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}