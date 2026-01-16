import { useState } from 'react';
import {
  Dialog,
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Field,
  Input,
  NativeSelect,
} from '@chakra-ui/react';
import { Users, Mail, Eye, UserCheck } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { useAccounts } from '../../../hooks/useAccounts';
import { useAddAccountMember } from '../../../hooks/useAccountMembers';
import { toast } from '../../../lib/toast';

interface AxiosError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface BfinParceiroDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BfinParceiroDialog({ isOpen, onClose }: BfinParceiroDialogProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const addMember = useAddAccountMember();

  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'member' | 'viewer'>('member');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning('Digite um email válido');
      return;
    }

    if (!selectedAccountId) {
      toast.warning('Selecione uma conta');
      return;
    }

    try {
      await addMember.mutateAsync({
        accountId: selectedAccountId,
        data: {
          email: email.trim(),
          role: selectedRole,
        },
      });

      setEmail('');
      setSelectedAccountId('');
      setSelectedRole('member');
      toast.success('Convite enviado com sucesso!');
      onClose();
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error('Erro ao enviar convite', axiosError.response?.data?.error);
    }
  };

  const handleClose = () => {
    setEmail('');
    setSelectedAccountId('');
    setSelectedRole('member');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="md">
          <Dialog.Header>
            <Flex align="center" gap={2}>
              <Users size={20} />
              <Dialog.Title>Convidar Bfin Parceiro</Dialog.Title>
            </Flex>
          </Dialog.Header>
          <Dialog.CloseTrigger />

          <Dialog.Body pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack gap={6} align="stretch">
                {/* Seleção de Conta */}
                <Field.Root>
                  <Field.Label>Selecione a conta</Field.Label>
                  {loadingAccounts ? (
                    <Text fontSize="sm" color="var(--muted-foreground)">
                      Carregando contas...
                    </Text>
                  ) : !accounts || accounts.length === 0 ? (
                    <Text fontSize="sm" color="var(--muted-foreground)">
                      Nenhuma conta disponível
                    </Text>
                  ) : (
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        placeholder="Selecione uma conta"
                        value={selectedAccountId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAccountId(e.target.value)}
                      >
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.account_name}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  )}
                </Field.Root>

                {/* Email do Parceiro */}
                <Field.Root>
                  <Field.Label>Email do parceiro</Field.Label>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Field.HelperText>Digite o email do parceiro que deseja convidar</Field.HelperText>
                </Field.Root>

                {/* Permissões */}
                <Field.Root>
                  <Field.Label>Permissões</Field.Label>
                  <VStack gap={3} align="stretch">
                    <Box
                      p={4}
                      borderWidth="2px"
                      borderColor={
                        selectedRole === 'member'
                          ? 'var(--primary)'
                          : 'var(--border)'
                      }
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={() => setSelectedRole('member')}
                      bg={
                        selectedRole === 'member'
                          ? 'var(--primary)'
                          : 'transparent'
                      }
                      color={
                        selectedRole === 'member'
                          ? 'var(--primary-foreground)'
                          : 'var(--card-foreground)'
                      }
                      transition="all 0.2s"
                      _hover={{
                        borderColor: 'var(--primary)',
                        bg: selectedRole === 'member' ? 'var(--primary)' : 'var(--accent)',
                      }}
                    >
                      <HStack gap={3}>
                        <UserCheck
                          size={20}
                          color={
                            selectedRole === 'member'
                              ? 'var(--primary-foreground)'
                              : 'var(--card-foreground)'
                          }
                        />
                        <VStack align="flex-start" gap={1} flex="1">
                          <Text fontWeight="semibold">Gerenciar conta</Text>
                          <Text fontSize="sm" opacity={0.8}>
                            O parceiro poderá gerenciar e fazer alterações na conta
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>

                    <Box
                      p={4}
                      borderWidth="2px"
                      borderColor={
                        selectedRole === 'viewer'
                          ? 'var(--primary)'
                          : 'var(--border)'
                      }
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={() => setSelectedRole('viewer')}
                      bg={
                        selectedRole === 'viewer'
                          ? 'var(--primary)'
                          : 'transparent'
                      }
                      color={
                        selectedRole === 'viewer'
                          ? 'var(--primary-foreground)'
                          : 'var(--card-foreground)'
                      }
                      transition="all 0.2s"
                      _hover={{
                        borderColor: 'var(--primary)',
                        bg: selectedRole === 'viewer' ? 'var(--primary)' : 'var(--accent)',
                      }}
                    >
                      <HStack gap={3}>
                        <Eye
                          size={20}
                          color={
                            selectedRole === 'viewer'
                              ? 'var(--primary-foreground)'
                              : 'var(--card-foreground)'
                          }
                        />
                        <VStack align="flex-start" gap={1} flex="1">
                          <Text fontWeight="semibold">Apenas visualizar</Text>
                          <Text fontSize="sm" opacity={0.8}>
                            O parceiro poderá apenas visualizar a conta, sem fazer alterações
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </VStack>
                </Field.Root>

                {/* Botões */}
                <HStack gap={3} justify="flex-end" mt={2}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={addMember.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={addMember.isPending || !email.trim() || !selectedAccountId}
                    loading={addMember.isPending}
                  >
                    <Flex align="center" gap={2}>
                      <Mail size={16} />
                      Enviar Convite
                    </Flex>
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
