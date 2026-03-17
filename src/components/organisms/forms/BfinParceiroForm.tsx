import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { HStack, VStack, Text, Box, Input, Field, Menu, chakra, Badge } from '@chakra-ui/react';
import { BaseForm } from '../../ui/BaseForm';
import { Button } from '../../atoms/Button';
import { useAccounts } from '../../../hooks/useAccounts';
import { useAddAccountMember } from '../../../hooks/useAccountMembers';
import { Mail, Check, ChevronDown, UserCheck, Eye, Zap, Users } from 'lucide-react';
import { iconColors } from '../../../theme';
import { toast } from '../../../lib/toast';

const inviteSchema = z.object({
  accountId: z.string().min(1, 'Selecione uma conta'),
  email: z.string().email('Email inválido'),
  role: z.enum(['member', 'viewer']),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface BfinParceiroFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  invitationsCount?: number;
  onOpenInvitations?: () => void;
}

export function BfinParceiroForm({
  onSuccess,
  onCancel,
  invitationsCount,
  onOpenInvitations,
}: BfinParceiroFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const addMember = useAddAccountMember();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      accountId: '',
      email: '',
      role: 'member',
    },
  });

  const selectedAccountId = watch('accountId');
  const selectedRole = watch('role');
  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);
  const pendingInvitations = invitationsCount ?? 0;
  const hasInvitations = pendingInvitations > 0;

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('accountId', defaultAccount.id, { shouldValidate: true });
      }
    }
  }, [accounts, selectedAccountId, setValue]);

  const onSubmit = async (data: InviteFormData) => {
    try {
      await addMember.mutateAsync({
        accountId: data.accountId,
        data: {
          email: data.email.trim(),
          role: data.role,
        },
      });

      toast.success('Convite enviado com sucesso!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }
      toast.error('Erro ao enviar convite', errorMessage);
    }
  };

  if (!loadingAccounts && (!accounts || accounts.length === 0)) {
    return (
      <BaseForm
        title="Convidar Parceiro"
        subtitle="Compartilhe o acesso da sua conta"
        icon={Users}
        variant="green-header"
        onBack={onCancel}
      >
        <Box px={{ base: 4, md: 6 }} py={8}>
          <VStack gap={4} align="center">
            <Text color="var(--muted-foreground)" fontSize="sm" textAlign="center">
              Você precisa criar uma conta primeiro.
            </Text>
            {onCancel && (
              <Button size="sm" variant="outline" onClick={onCancel}>
                Voltar
              </Button>
            )}
          </VStack>
        </Box>
      </BaseForm>
    );
  }

  return (
    <BaseForm
      title="Convidar Parceiro"
      subtitle="Compartilhe o acesso da sua conta"
      icon={Users}
      variant="green-header"
      onBack={onCancel}
      isLoading={loadingAccounts}
      formId="bfin-parceiro-form"
      onSubmit={handleSubmit(onSubmit)}
      primaryAction={{
        label: "Enviar Convite",
        loading: isSubmitting || addMember.isPending,
        onClick: () => {},
      }}
      contentPb={24}
    >
      <Box px={{ base: 4, md: 6 }} py={4}>
        <VStack gap={6} align="stretch">
          {/* Dropdown de Conta */}
          <Field.Root invalid={!!errors.accountId}>
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
                      onClick={() => setValue('accountId', account.id ?? '', { shouldValidate: true })}
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
            {errors.accountId && (
              <Field.ErrorText mt={2} fontSize="sm">
                {errors.accountId.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          {/* Convites recebidos */}
          <Box
            bg="var(--card)"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="var(--border)"
            p={4}
            boxShadow="sm"
          >
            <HStack justify="space-between" align="center" gap={4} flexWrap="wrap">
              <HStack gap={3}>
                <Box
                  bg="var(--primary)"
                  color="var(--primary-foreground)"
                  borderRadius="full"
                  p={2}
                >
                  <Mail size={16} />
                </Box>
                <VStack align="flex-start" gap={1}>
                  <Text fontSize="sm" color="var(--muted-foreground)">
                    Convites recebidos
                  </Text>
                  <HStack gap={2}>
                    <Text fontSize="md" fontWeight="semibold" color="var(--foreground)">
                      {hasInvitations
                        ? `Você tem ${pendingInvitations} convite${pendingInvitations === 1 ? '' : 's'} pendente${pendingInvitations === 1 ? '' : 's'}.`
                        : 'Você não tem convites pendentes.'}
                    </Text>
                    {hasInvitations && (
                      <Badge
                        bg="var(--primary)"
                        color="var(--primary-foreground)"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                      >
                        {pendingInvitations}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </HStack>
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenInvitations}
                disabled={!onOpenInvitations}
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
                Ver convites
              </Button>
            </HStack>
          </Box>

          {/* Card de formulário */}
          <Box
            bg="var(--card)"
            borderRadius="2xl"
            p={6}
            shadow="md"
          >
            <VStack gap={6} align="stretch">
              {/* Email */}
              <Field.Root invalid={!!errors.email}>
                <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                  Email do Parceiro
                </Field.Label>
                <Box position="relative">
                  <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                    <Mail size={18} color="var(--muted-foreground)" />
                  </Box>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="exemplo@email.com"
                    pl={10}
                    borderColor="var(--border)"
                    borderRadius="full"
                    _focus={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' }}
                  />
                </Box>
                {errors.email && (
                  <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                )}
              </Field.Root>

              {/* Permissões */}
              <Field.Root>
                <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
                  Nível de Acesso
                </Field.Label>
                <VStack gap={3} align="stretch">
                  {/* Member Role */}
                  <chakra.button
                    type="button"
                    onClick={() => setValue('role', 'member')}
                    textAlign="left"
                    p={4}
                    borderWidth="2px"
                    borderColor={selectedRole === 'member' ? 'var(--primary)' : 'var(--border)'}
                    borderRadius="xl"
                    bg={selectedRole === 'member' ? 'var(--primary)' : 'transparent'}
                    color={selectedRole === 'member' ? 'var(--primary-foreground)' : 'var(--card-foreground)'}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'var(--primary)',
                      opacity: selectedRole === 'member' ? 1 : 0.7
                    }}
                  >
                    <HStack gap={3}>
                      <UserCheck size={24} />
                      <VStack align="flex-start" gap={0} flex="1">
                        <Text fontWeight="bold">Gerenciar conta</Text>
                        <Text fontSize="xs" opacity={0.9}>
                          Pode fazer transações e gerenciar a conta
                        </Text>
                      </VStack>
                    </HStack>
                  </chakra.button>

                  {/* Viewer Role */}
                  <chakra.button
                    type="button"
                    onClick={() => setValue('role', 'viewer')}
                    textAlign="left"
                    p={4}
                    borderWidth="2px"
                    borderColor={selectedRole === 'viewer' ? 'var(--primary)' : 'var(--border)'}
                    borderRadius="xl"
                    bg={selectedRole === 'viewer' ? 'var(--primary)' : 'transparent'}
                    color={selectedRole === 'viewer' ? 'var(--primary-foreground)' : 'var(--card-foreground)'}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'var(--primary)',
                      opacity: selectedRole === 'viewer' ? 1 : 0.7
                    }}
                  >
                    <HStack gap={3}>
                      <Eye size={24} />
                      <VStack align="flex-start" gap={0} flex="1">
                        <Text fontWeight="bold">Apenas visualizar</Text>
                        <Text fontSize="xs" opacity={0.9}>
                          Pode apenas ver o saldo e extrato
                        </Text>
                      </VStack>
                    </HStack>
                  </chakra.button>
                </VStack>
              </Field.Root>

              {/* Info Box */}
              <Box
                bg={{ base: 'brand.50', _dark: 'brand.950' }}
                borderWidth="1px"
                borderColor={{ base: 'brand.200', _dark: 'brand.800' }}
                borderRadius="lg"
                p={4}
              >
                <HStack gap={2} mb={3}>
                  <Zap size={18} color={iconColors.brandDark} />
                  <Text fontWeight="semibold" color={{ base: 'brand.700', _dark: 'brand.300' }} fontSize="sm">
                    O que é um Bfin Parceiro?
                  </Text>
                </HStack>
                <VStack gap={2} align="stretch" fontSize="sm" color="var(--foreground)">
                  <HStack gap={2} align="flex-start">
                    <Check size={16} color={iconColors.brandDark} />
                    <Text>
                      Uma pessoa de confiança para <strong>compartilhar o acesso</strong> da sua conta.
                    </Text>
                  </HStack>
                  <HStack gap={2} align="flex-start">
                    <Check size={16} color={iconColors.brandDark} />
                    <Text>
                      Ideal para casais, sócios ou familiares.
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </BaseForm>
  );
}
