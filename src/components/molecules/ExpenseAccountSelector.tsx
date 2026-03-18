import {
  Box,
  Text,
  HStack,
  Field,
  Menu,
} from '@chakra-ui/react';
import { ChevronDown, Check } from 'lucide-react';
import { iconColors } from '../../theme';
import type { UseFormRegister } from 'react-hook-form';
import type { Account } from '@igorguariroba/bfin-sdk/client';
import type { ExpenseFormData } from '../../hooks/useExpenseFormState';

interface ExpenseAccountSelectorProps {
  accounts?: Account[];
  selectedAccountId: string;
  onAccountSelect: (accountId: string) => void;
  register: UseFormRegister<ExpenseFormData>;
  error?: string;
}

export function ExpenseAccountSelector({
  accounts,
  selectedAccountId,
  onAccountSelect,
  register,
  error,
}: ExpenseAccountSelectorProps) {
  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  return (
    <Field.Root invalid={!!error}>
      <input type="hidden" {...register('accountId')} />
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
            _hover={{ borderColor: 'var(--primary)' }}
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
            css={{ zIndex: 'var(--z-dropdown)' }}
          >
            {accounts?.map((account) => (
              <Menu.Item
                key={account.id ?? ''}
                value={account.id ?? ''}
                onClick={() => onAccountSelect(account.id ?? '')}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                bg={selectedAccountId === account.id ? 'var(--muted)' : 'transparent'}
                _hover={{ bg: 'var(--muted)' }}
              >
                <HStack justify="space-between" w="full">
                  <Text fontWeight="medium" color="var(--card-foreground)">
                    {account.account_name}
                  </Text>
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