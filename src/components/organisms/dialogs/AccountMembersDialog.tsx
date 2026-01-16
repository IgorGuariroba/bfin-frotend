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
  IconButton,
  NativeSelect,
} from '@chakra-ui/react';
import { Users, UserPlus, Trash2, Crown, Eye, User as UserIcon, Mail, Clock } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { FormField } from '../../molecules/FormField';
import { FormSelect } from '../../molecules/FormSelect';
import { RoleDisplay } from '../../molecules/RoleDisplay';
import { useAccountMembers, useAddAccountMember, useRemoveAccountMember, useUpdateMemberRole, useAccountInvitations } from '../../../hooks/useAccountMembers';
import { confirm } from '../../ui/ConfirmDialog';
import { toast } from '../../../lib/toast';

interface AccountMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountName: string;
}

export function AccountMembersDialog({ isOpen, onClose, accountId, accountName }: AccountMembersDialogProps) {
  const { data: membersData, isLoading } = useAccountMembers(accountId);
  const { data: invitations = [], isLoading: isLoadingInvitations } = useAccountInvitations(accountId);
  const addMember = useAddAccountMember();
  const removeMember = useRemoveAccountMember();
  const updateRole = useUpdateMemberRole();

  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'owner' | 'member' | 'viewer'>('member');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [roleChangeData, setRoleChangeData] = useState<{
    userId: string;
    userName: string;
    currentRole: string;
  } | null>(null);
  const [newRole, setNewRole] = useState<'owner' | 'member' | 'viewer'>('member');

  const members = membersData?.members || [];
  const originalOwnerId = membersData?.original_owner_id;
  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'member':
        return UserIcon;
      case 'viewer':
        return Eye;
      default:
        return UserIcon;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Proprietário',
      member: 'Membro',
      viewer: 'Visualizador',
    };
    return labels[role] || role;
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning('Digite um email válido');
      return;
    }

    try {
      await addMember.mutateAsync({
        accountId,
        data: {
          email: email.trim(),
          role: selectedRole,
        },
      });

      setEmail('');
      setSelectedRole('member');
      setShowAddForm(false);
      toast.success('Convite enviado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao enviar convite', error.response?.data?.error);
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    const confirmed = await confirm({
      title: 'Remover Membro',
      description: `Deseja remover ${userName} desta conta?`,
      confirmLabel: 'Remover',
      cancelLabel: 'Cancelar',
      colorPalette: 'red',
    });

    if (confirmed) {
      try {
        await removeMember.mutateAsync({ accountId, userId });
        toast.success('Membro removido com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao remover membro', error.response?.data?.error);
      }
    }
  };

  const handleChangeRole = (userId: string, userName: string, currentRole: string) => {
    setRoleChangeData({ userId, userName, currentRole });
    setNewRole(currentRole as 'owner' | 'member' | 'viewer');
    setShowRoleDialog(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeData) return;

    try {
      await updateRole.mutateAsync({
        accountId,
        userId: roleChangeData.userId,
        role: newRole,
      });
      setShowRoleDialog(false);
      setRoleChangeData(null);
      toast.success('Permissão atualizada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar permissão', error.response?.data?.error);
    }
  };

  return (
    <>
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
          <Dialog.Content maxW="4xl">
          <Dialog.Header>
            <Flex align="center" gap={2}>
              <Icon as={Users} />
              <Dialog.Title>Membros da Conta - {accountName}</Dialog.Title>
            </Flex>
          </Dialog.Header>
          <Dialog.CloseTrigger />

          <Dialog.Body pb={6}>
          {/* Add Member Button */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              mb={4}
            >
              <UserPlus size={16} style={{ marginRight: '8px' }} />
              Adicionar Membro
            </Button>
          )}

          {/* Add Member Form */}
          {showAddForm && (
            <Box as="form" onSubmit={handleAddMember} mb={4} p={4} bg="gray.50" borderRadius="lg">
              <Text fontWeight="medium" color="gray.900" mb={3}>Convidar Membro</Text>

              <Stack gap={3}>
                <FormField
                  label="Email do usuário"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  isRequired
                />

                <FormSelect
                  label="Permissão"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'owner' | 'member' | 'viewer')}
                >
                  <option value="viewer">Visualizador - Apenas visualiza</option>
                  <option value="member">Membro - Pode criar transações</option>
                  <option value="owner">Proprietário - Controle total</option>
                </FormSelect>
              </Stack>

              <Flex gap={2} mt={4}>
                <Button type="submit" disabled={addMember.isPending}>
                  {addMember.isPending ? 'Adicionando...' : 'Adicionar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEmail('');
                  }}
                >
                  Cancelar
                </Button>
              </Flex>
            </Box>
          )}

          {/* Members List */}
          {isLoading ? (
            <Center py={8}>
              <Stack gap={2} align="center">
                <Spinner size="lg" color="brand.600" />
                <Text color="gray.600">Carregando membros...</Text>
              </Stack>
            </Center>
          ) : (
            <Stack gap={2}>
              {members?.map((member) => (
                <Flex
                  key={member.id}
                  align="center"
                  justify="space-between"
                  p={4}
                  bg="card"
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  _hover={{ shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap={3}>
                    <Icon as={getRoleIcon(member.role)} boxSize={4} color={`${member.role === 'owner' ? 'yellow' : member.role === 'member' ? 'blue' : 'gray'}.600`} />
                    <Box>
                      <Text fontWeight="medium" color="gray.900">{member.user.full_name}</Text>
                      <Text fontSize="sm" color="gray.600">{member.user.email}</Text>
                    </Box>
                  </Flex>

                  <Flex align="center" gap={3}>
                    <RoleDisplay role={member.role} />

                    {/* Only show actions for non-original-owners */}
                    {member.user_id !== originalOwnerId && (
                      <Flex gap={2}>
                        <Button
                          onClick={() => handleChangeRole(member.user_id, member.user.full_name, member.role)}
                          size="sm"
                          variant="ghost"
                          colorPalette="blue"
                        >
                          Alterar
                        </Button>
                        <IconButton
                          onClick={() => handleRemoveMember(member.user_id, member.user.full_name)}
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          aria-label="Remover membro"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              ))}

              {members.length === 0 && (
                <Center py={8}>
                  <Text color="gray.500">Nenhum membro adicionado ainda</Text>
                </Center>
              )}
            </Stack>
          )}

          {/* Pending Invitations Section */}
          {!isLoading && !isLoadingInvitations && pendingInvitations.length > 0 && (
            <Box mt={6}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                <Flex align="center" gap={2}>
                  <Icon as={Mail} boxSize={4} />
                  <span>Convites Pendentes</span>
                </Flex>
              </Text>
              <Stack gap={2}>
                {pendingInvitations.map((invitation) => (
                  <Flex
                    key={invitation.id}
                    align="center"
                    justify="space-between"
                    p={4}
                    bg="yellow.50"
                    borderWidth="1px"
                    borderColor="yellow.200"
                    borderRadius="lg"
                  >
                    <Flex align="center" gap={3}>
                      <Icon as={Clock} boxSize={4} color="yellow.600" />
                      <Box>
                        <Text fontWeight="medium" color="gray.900">{invitation.invited_email}</Text>
                        <Text fontSize="xs" color="gray.600">
                          Convidado por {invitation.inviter.full_name}
                        </Text>
                      </Box>
                    </Flex>

                    <Flex align="center" gap={3}>
                      <Badge colorPalette="gray" px={3} py={1}>
                        {getRoleLabel(invitation.role)}
                      </Badge>
                      <Text fontSize="xs" color="yellow.700">
                        Aguardando
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              </Stack>
            </Box>
          )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>

    {/* Dialog para mudança de role */}
    <Dialog.Root open={showRoleDialog} onOpenChange={(e) => setShowRoleDialog(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Alterar Permissão</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {roleChangeData && (
              <Stack gap={4}>
                <Text>
                  Alterar permissão de <strong>{roleChangeData.userName}</strong>
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Permissão atual: <strong>{getRoleLabel(roleChangeData.currentRole)}</strong>
                </Text>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Nova permissão:
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={newRole}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRole(e.target.value as 'owner' | 'member' | 'viewer')}
                    >
                      <option value="owner">Proprietário</option>
                      <option value="member">Membro</option>
                      <option value="viewer">Visualizador</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
              </Stack>
            )}
          </Dialog.Body>
          <Dialog.Footer gap={2}>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancelar
            </Button>
            <Button colorPalette="blue" onClick={handleConfirmRoleChange}>
              Confirmar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
    </>
  );
}
