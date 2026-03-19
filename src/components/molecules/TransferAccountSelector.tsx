import { Box, Text, Menu, HStack, Field } from '@chakra-ui/react';
import { Check, ChevronDown } from 'lucide-react';
import type { Account } from '@igorguariroba/bfin-sdk/client';
import type { UseFormRegister } from 'react-hook-form';
import type { TransferFormData } from '../../hooks/useTransferFormState';

interface TransferAccountSelectorProps {
  accounts?: Account[];
  selectedAccountId: string;
  onAccountSelect: (accountId: string) => void;
  register: UseFormRegister<TransferFormData>;
  error?: string;
}

export function TransferAccountSelector({
  accounts,
  selectedAccountId,
  onAccountSelect,
  register,
  error
}: TransferAccountSelectorProps) {
  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  return (
    <Field.Root invalid={!!error}>
      <input type="hidden" {...register('sourceAccountId')} />
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
            color="var(--foreground)"
            bg="var(--background)"
            borderWidth="1px"
            borderColor="var(--border)"
            borderRadius="full"
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
            <Text color="var(--foreground)" truncate>
              {selectedAccount
                ? selectedAccount.account_name
                : 'Selecione uma conta'}
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
            p={0}
            css={{
              zIndex: 'var(--z-dropdown)',
            }}
          >
            <Box
              px={3}
              py={2}
              bg="var(--card)"
              borderTopRadius="lg"
              borderBottomWidth="1px"
              borderBottomColor="var(--border)"
            >
              <HStack gap={2}>
                <Check size={16} />
                <Text fontSize="sm" fontWeight="bold">
                  Selecione uma conta
                </Text>
              </HStack>
            </Box>

            <Box py={1}>
              {accounts?.map((account) => (
                <Menu.Item
                  key={account.id ?? ''}
                  value={account.id ?? ''}
                  onClick={() => onAccountSelect(account.id ?? '')}
                  css={{
                    backgroundColor:
                      selectedAccountId === account.id
                        ? 'var(--muted)'
                        : 'transparent',
                    '&:hover': {
                      backgroundColor: 'var(--muted)',
                    },
                  }}
                  px={3}
                  py={2}
                >
                  <Text fontSize="sm" truncate>
                    {account.account_name}
                  </Text>
                </Menu.Item>
              ))}
            </Box>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      {error && (
        <Field.ErrorText>{error}</Field.ErrorText>
      )}
    </Field.Root>
  );
}