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
} from '@chakra-ui/react';
import { Mail, Check, X, Clock, User } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { useMyInvitations, useAcceptInvitation, useRejectInvitation } from '../../../hooks/useAccountMembers';
import { confirm } from '../../ui/ConfirmDialog';
import { toast } from '../../../lib/toast';

interface AxiosError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface InvitationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvitationsDialog({ isOpen, onClose }: InvitationsDialogProps) {
  const { data: invitations = [], isLoading } = useMyInvitations();
  const acceptInvitation = useAcceptInvitation();
  const rejectInvitation = useRejectInvitation();

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Proprietário',
      member: 'Membro',
      viewer: 'Visualizador',
    };
    return labels[role] || role;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleAccept = async (token: string, accountName: string) => {
    const confirmed = await confirm({
      title: 'Aceitar Convite',
      description: `Deseja aceitar o convite para a conta "${accountName}"?`,
      confirmLabel: 'Aceitar',
      cancelLabel: 'Cancelar',
      colorPalette: 'green',
    });

    if (confirmed) {
      try {
        await acceptInvitation.mutateAsync(token);
        toast.success('Convite aceito com sucesso!');
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        toast.error('Erro ao aceitar convite', axiosError.response?.data?.error);
      }
    }
  };

  const handleReject = async (token: string, accountName: string) => {
    const confirmed = await confirm({
      title: 'Rejeitar Convite',
      description: `Deseja rejeitar o convite para a conta "${accountName}"?`,
      confirmLabel: 'Rejeitar',
      cancelLabel: 'Cancelar',
      colorPalette: 'red',
    });

    if (confirmed) {
      try {
        await rejectInvitation.mutateAsync(token);
        toast.info('Convite rejeitado');
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        toast.error('Erro ao rejeitar convite', axiosError.response?.data?.error);
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
          <Dialog.Content
            maxW="5xl"
            bg="var(--card)"
            color="var(--foreground)"
            borderWidth="1px"
            borderColor="var(--border)"
            borderRadius="xl"
            boxShadow="var(--shadow-md)"
          >
          <Dialog.Header>
            <Flex align="center" gap={2}>
              <Icon as={Mail} color="var(--muted-foreground)" />
              <Dialog.Title>Meus Convites</Dialog.Title>
            </Flex>
          </Dialog.Header>
          <Dialog.CloseTrigger />

          <Dialog.Body pb={6}>
          {isLoading ? (
            <Center py={8}>
              <Stack gap={2} align="center">
                <Spinner size="lg" color="var(--primary)" />
                <Text color="var(--muted-foreground)">Carregando convites...</Text>
              </Stack>
            </Center>
          ) : (
            <Stack gap={3}>
              {invitations.map((invitation) => (
                <Box
                  key={invitation.id}
                  p={5}
                  bg="var(--card)"
                  borderWidth="1px"
                  borderColor="var(--border)"
                  borderRadius="xl"
                  boxShadow="var(--shadow-card)"
                  _hover={{
                    boxShadow: 'var(--shadow-card-hover)',
                  }}
                  transition="all 0.2s"
                >
                  {/* Header */}
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <Box flex="1">
                      <Text fontSize="lg" fontWeight="semibold" color="var(--foreground)" mb={1}>
                        {invitation.account?.account_name || 'Conta'}
                      </Text>
                      <Flex align="center" gap={2} fontSize="sm" color="var(--muted-foreground)">
                        <Icon as={User} boxSize={4} />
                        <Text>Convidado por {invitation.inviter.full_name}</Text>
                      </Flex>
                    </Box>
                  </Flex>

                  {/* Details */}
                  <Flex align="center" gap={4} mb={4} flexWrap="wrap">
                    <Flex align="center" gap={2} fontSize="sm">
                      <Text color="var(--muted-foreground)">Permissão:</Text>
                      <Badge
                        bg="var(--secondary)"
                        color="var(--foreground)"
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {getRoleLabel(invitation.role)}
                      </Badge>
                    </Flex>
                    <Flex align="center" gap={2} fontSize="sm" color="var(--muted-foreground)">
                      <Icon as={Clock} boxSize={4} />
                      <Text>Expira em {formatDate(invitation.expires_at)}</Text>
                    </Flex>
                  </Flex>

                  {/* Actions */}
                  <Flex gap={2}>
                    <Button
                      onClick={() => handleAccept(invitation.token, invitation.account?.account_name || 'Conta')}
                      disabled={acceptInvitation.isPending || rejectInvitation.isPending}
                      bg="var(--primary)"
                      color="var(--primary-foreground)"
                      boxShadow="var(--shadow-button-primary)"
                      _hover={{ bg: 'var(--primary-600)' }}
                      _active={{ bg: 'var(--primary-700)' }}
                      _focusVisible={{
                        outline: 'none',
                        boxShadow: '0 0 0 2px var(--ring)',
                      }}
                      _disabled={{
                        bg: 'var(--accent)',
                        color: 'var(--gray-400)',
                        boxShadow: 'none',
                        cursor: 'not-allowed',
                      }}
                    >
                      <Flex align="center" gap={2}>
                        <Check size={16} />
                        Aceitar
                      </Flex>
                    </Button>
                    <Button
                      onClick={() => handleReject(invitation.token, invitation.account?.account_name || 'Conta')}
                      disabled={acceptInvitation.isPending || rejectInvitation.isPending}
                      variant="outline"
                      bg="var(--secondary)"
                      color="var(--foreground)"
                      borderColor="var(--border)"
                      _hover={{ bg: 'var(--accent)' }}
                      _active={{ bg: 'var(--secondary)' }}
                      _focusVisible={{
                        outline: 'none',
                        boxShadow: '0 0 0 2px var(--ring)',
                      }}
                      _disabled={{
                        bg: 'var(--accent)',
                        color: 'var(--gray-400)',
                        borderColor: 'var(--border)',
                        boxShadow: 'none',
                        cursor: 'not-allowed',
                      }}
                    >
                      <Flex align="center" gap={2}>
                        <X size={16} />
                        Recusar
                      </Flex>
                    </Button>
                  </Flex>
                </Box>
              ))}

              {invitations.length === 0 && (
                <Center py={12}>
                  <Stack gap={3} align="center">
                    <Icon as={Mail} boxSize={12} color="var(--muted-foreground)" opacity={0.5} />
                    <Text color="var(--muted-foreground)">Você não tem convites pendentes</Text>
                  </Stack>
                </Center>
              )}
            </Stack>
          )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
