import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Stack, HStack, VStack, Center, Text, Box, Input, Field, Menu, chakra } from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useAccounts } from '../../../hooks/useAccounts';
import { useAddAccountMember } from '../../../hooks/useAccountMembers';
import { Mail, Check, ChevronDown, UserCheck, Eye, Zap } from 'lucide-react';
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
}

export function BfinParceiroForm({ onSuccess, onCancel }: BfinParceiroFormProps) {
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

  if (loadingAccounts) {
    return (
      <Center py={4}>
        <Text>Carregando...</Text>
      </Center>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Center py={4}>
        <Stack gap={4} align="center">
          <Text color="gray.600">Você precisa criar uma conta primeiro.</Text>
          {onCancel && <Button onClick={onCancel}>Voltar</Button>}
        </Stack>
      </Center>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={0} align="stretch">
        {/* Header - Seleção de Conta e Título */}
        <Box mb={6}>
          <Center mb={4}>
             <VStack gap={1}>
                <Text fontSize="xl" fontWeight="bold" color="var(--primary-foreground)">Convidar Parceiro</Text>
                <Text fontSize="sm" color="whiteAlpha.800">Compartilhe o acesso da sua conta</Text>
             </VStack>
          </Center>

          {/* Dropdown de Conta Customizado */}
          <Field.Root invalid={!!errors.accountId}>
            <input type="hidden" {...register('accountId')} />
            <Menu.Root positioning={{ placement: 'bottom-start', sameWidth: true }}>
              <Menu.Trigger asChild>
                <chakra.button
                  w="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  px={4}
                  py={3}
                  fontSize="md"
                  fontWeight="medium"
                  color="primary.fg"
                  bg="var(--primary)"
                  borderWidth="1px"
                  borderColor="primary.fg"
                  borderRadius="full"
                  transition="all 0.2s"
                  css={{
                    '&:hover': {
                      backgroundColor: iconColors.brandDark,
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <Text color="primary.fg">
                    {selectedAccount ? selectedAccount.account_name : 'Selecione uma conta'}
                  </Text>
                  <ChevronDown size={20} color={iconColors.primaryFg} />
                </chakra.button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content
                  maxH="300px"
                  overflowY="auto"
                  bg="var(--primary)"
                  borderRadius="lg"
                  boxShadow="lg"
                  borderWidth="1px"
                  borderColor="primary.fg"
                  p={0}
                  css={{
                    zIndex: 'var(--z-dropdown)',
                  }}
                >
                  <Box
                    px={3}
                    py={2}
                    bg="var(--primary)"
                    borderTopRadius="lg"
                    borderBottomWidth="1px"
                    borderBottomColor="primary.fg"
                  >
                    <HStack gap={2}>
                      <Check size={16} color={iconColors.primaryFg} />
                      <Text fontSize="sm" fontWeight="bold" color="primary.fg">
                        Selecione uma conta
                      </Text>
                    </HStack>
                  </Box>

                  <Box py={1}>
                    {accounts?.map((account) => (
                      <Menu.Item
                        key={account.id ?? ''}
                        value={account.id ?? ''}
                        onClick={() => setValue('accountId', account.id ?? '', { shouldValidate: true })}
                        css={{
                          backgroundColor: selectedAccountId === account.id ? iconColors.brandDark : 'transparent',
                          '&:hover': {
                            backgroundColor: iconColors.brandDark,
                          },
                        }}
                        px={3}
                        py={2}
                      >
                        <Text fontSize="sm" color="var(--primary-foreground)">
                          {account.account_name}
                        </Text>
                      </Menu.Item>
                    ))}
                  </Box>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            {errors.accountId && (
              <Field.ErrorText color="var(--primary-foreground)" mt={2} fontSize="sm">
                {errors.accountId.message}
              </Field.ErrorText>
            )}
          </Field.Root>
        </Box>

        {/* Card Branco */}
        <Box
          bg="var(--card)"
          borderRadius="2xl"
          p={6}
          shadow="md"
          mt={4}
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
              mt={2}
            >
              <HStack gap={2} mb={3}>
                <Zap size={18} color={iconColors.brandDark} />
                <Text fontWeight="semibold" color={{ base: 'brand.700', _dark: 'brand.300' }} fontSize="sm">
                  O que é um Bfin Parceiro?
                </Text>
              </HStack>
              <VStack gap={2} align="stretch" fontSize="sm" color="muted.fg">
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

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isSubmitting || addMember.isPending}
              w="full"
              size="lg"
              bg="var(--primary)"
              color="var(--primary-foreground)"
              borderRadius="full"
              _hover={{ opacity: 0.9 }}
              mt={2}
            >
              Enviar Convite
            </Button>

            {/* Cancelar */}
            {onCancel && (
              <Text
                as="button"
                onClick={onCancel}
                textAlign="center"
                color={iconColors.brandDark}
                fontSize="sm"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
                cursor="pointer"
              >
                Cancelar
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </form>
  );
}
