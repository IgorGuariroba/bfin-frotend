import { useState } from 'react';
import {
  Dialog,
  Box,
  Flex,
  Text,
  Badge,
  Stack,
  Spinner,
  Center,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { Wallet, Users, UserPlus } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { BalanceCard } from '../../molecules/BalanceCard';
import { useAccounts } from '../../../hooks/useAccounts';
import { AccountMembersDialog } from './AccountMembersDialog';

interface AccountsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountsDialog({ isOpen, onClose }: AccountsDialogProps) {
  const { data: accounts, isLoading } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedAccountName, setSelectedAccountName] = useState<string>('');
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);

  const handleManageMembers = (accountId: string, accountName: string) => {
    setSelectedAccountId(accountId);
    setSelectedAccountName(accountName);
    setMembersDialogOpen(true);
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="7xl">
            <Dialog.Header>
              <Flex align="center" gap={2}>
                <Icon as={Wallet} />
                <Dialog.Title>Minhas Contas</Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.CloseTrigger />

            <Dialog.Body pb={6}>
            {isLoading ? (
              <Center py={8}>
                <Stack gap={2} align="center">
                  <Spinner size="lg" colorPalette="brand" />
                  <Text color={{ base: 'muted.fg', _dark: 'muted.fg' }}>Carregando contas...</Text>
                </Stack>
              </Center>
            ) : (
              <Stack gap={4}>
                {accounts?.map((account) => (
                  <Box
                    key={account.id}
                    p={5}
                    bg={{ base: 'card', _dark: 'card' }}
                    borderWidth="1px"
                    borderColor={{ base: 'border', _dark: 'border' }}
                    borderRadius="lg"
                    _hover={{ shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    {/* Header with badges */}
                    <Flex justify="space-between" align="flex-start" mb={4}>
                      <Box flex="1">
                        <Text fontSize="lg" fontWeight="semibold" color={{ base: 'fg', _dark: 'fg' }} mb={2}>
                          {account.account_name}
                        </Text>
                        <Flex gap={2} flexWrap="wrap">
                          {account.is_default && (
                            <Badge colorPalette="blue" fontSize="xs" px={2} py={1}>
                              Padrão
                            </Badge>
                          )}
                          {account.is_shared && (
                            <Badge colorPalette="brand" fontSize="xs" px={2} py={1}>
                              <Flex align="center" gap={1}>
                                <Icon as={Users} boxSize={3} />
                                <span>Compartilhada</span>
                              </Flex>
                            </Badge>
                          )}
                          {account.user_role === 'owner' && (
                            <Badge colorPalette="yellow" fontSize="xs" px={2} py={1}>
                              Proprietário
                            </Badge>
                          )}
                          {account.user_role === 'member' && (
                            <Badge colorPalette="brand" fontSize="xs" px={2} py={1}>
                              Membro
                            </Badge>
                          )}
                        </Flex>
                      </Box>

                      <Button
                        onClick={() => handleManageMembers(account.id, account.account_name)}
                        size="sm"
                        ml={4}
                        flexShrink={0}
                      >
                        <UserPlus size={16} style={{ marginRight: '8px' }} />
                        Membros
                      </Button>
                    </Flex>

                    {/* Balances using BalanceCard molecule */}
                    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
                      <BalanceCard
                        label="Disponível"
                        amount={Number(account.available_balance)}
                        variant="available"
                      />
                      <BalanceCard
                        label="Bloqueado"
                        amount={Number(account.locked_balance)}
                        variant="locked"
                      />
                      <BalanceCard
                        label="Reserva"
                        amount={Number(account.emergency_reserve)}
                        variant="reserve"
                      />
                      <BalanceCard
                        label="Total"
                        amount={Number(account.total_balance)}
                        variant="total"
                      />
                    </SimpleGrid>
                  </Box>
                ))}

                {accounts?.length === 0 && (
                  <Center py={8}>
                    <Text color={{ base: 'muted.fg', _dark: 'muted.fg' }}>Nenhuma conta encontrada</Text>
                  </Center>
                )}
              </Stack>
            )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Members Dialog */}
      {selectedAccountId && (
        <AccountMembersDialog
          isOpen={membersDialogOpen}
          onClose={() => setMembersDialogOpen(false)}
          accountId={selectedAccountId}
          accountName={selectedAccountName}
        />
      )}
    </>
  );
}
