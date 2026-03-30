import { Box, HStack, VStack, Text, Menu, Field } from '@chakra-ui/react';
import { ChevronDown, Check } from 'lucide-react';
import { iconColors } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import type { UseFormRegister } from 'react-hook-form';
import type { Account } from '@igorguariroba/bfin-sdk/client';

// Interface compatível com SDKAccount do useAccountSelection
interface SDKAccount {
  id?: string;
  account_name: string;
  available_balance: string;
  is_default?: boolean;
}

// Tipo union para aceitar ambos os tipos de conta
type AccountType = Account | SDKAccount;

interface AccountSelectorProps {
  accounts?: AccountType[];
  selectedAccountId: string;
  onAccountSelect: (accountId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  error?: string;
  fieldName?: string;
  placeholder?: string;
  label?: string;
  showBalance?: boolean;
}

/**
 * Componente de seleção de conta com dropdown customizado
 * Pode ser usado tanto para formulários (com register) quanto para uso standalone
 */
export function AccountSelector({
  accounts,
  selectedAccountId,
  onAccountSelect,
  register,
  error,
  fieldName = 'accountId',
  placeholder = 'Selecione uma conta',
  label,
  showBalance = false
}: AccountSelectorProps) {
  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  return (
    <Field.Root invalid={!!error}>
      {label && (
        <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
          {label}
        </Field.Label>
      )}
      {register && (
        <input type="hidden" {...register(fieldName)} />
      )}
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
            data-testid="field-conta"
          >
            <Text>
              {selectedAccount ? selectedAccount.account_name : placeholder}
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
            css={{ zIndex: 'var(--z-dropdown)' }}
          >
            {accounts?.map((account) => (
              <Menu.Item
                key={account.id || ''}
                value={account.id || ''}
                onClick={() => account.id && onAccountSelect(account.id)}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                bg={selectedAccountId === account.id ? 'var(--muted)' : 'transparent'}
                _hover={{
                  bg: 'var(--muted)',
                }}
              >
                <HStack justify="space-between" w="full">
                  {showBalance ? (
                    <VStack align="flex-start" gap={0}>
                      <Text fontWeight="medium" color="var(--card-foreground)">
                        {account.account_name}
                      </Text>
                      <Text fontSize="sm" color="var(--muted-foreground)">
                        {formatCurrency(Number(account.available_balance))}
                      </Text>
                    </VStack>
                  ) : (
                    <Text fontWeight="medium" color="var(--card-foreground)">
                      {account.account_name}
                    </Text>
                  )}
                  {selectedAccountId === account.id && (
                    <Check size={16} color={iconColors.success} />
                  )}
                </HStack>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      {error && (
        <Field.ErrorText mt={2} fontSize="sm">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
}