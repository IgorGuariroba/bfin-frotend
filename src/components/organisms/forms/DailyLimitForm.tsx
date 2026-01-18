import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Stack,
  HStack,
  VStack,
  Center,
  Text,
  Box,
  Input,
  Field,
  Menu,
} from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useAccounts } from '../../../hooks/useAccounts';
import { useTotalDailyLimit } from '../../../hooks/useDailyLimit';
import { ChevronDown, Check, Zap } from 'lucide-react';
import { iconColors } from '../../../theme';

const dailyLimitSchema = z.object({
  accountId: z.string().min(1, 'Conta é obrigatória'),
  newLimit: z.number().positive('Limite deve ser positivo'),
});

type DailyLimitFormData = z.infer<typeof dailyLimitSchema>;

interface DailyLimitFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DailyLimitForm({ onSuccess, onCancel }: DailyLimitFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const accountIds = accounts?.map(acc => acc.id ?? '') ?? [];
  const { data: limitData, isLoading: loadingLimit } = useTotalDailyLimit(accountIds);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DailyLimitFormData>({
    resolver: zodResolver(dailyLimitSchema),
    defaultValues: {
      accountId: '',
      newLimit: 0,
    },
  });

  const newLimit = watch('newLimit') || 0;
  const selectedAccountId = watch('accountId');
  const [isEditingLimit, setIsEditingLimit] = useState(false);

  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  // Define a conta padrão quando as contas forem carregadas
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setValue('accountId', defaultAccount.id, { shouldValidate: true });
        setValue('newLimit', limitData?.totalDailyLimit || 100.50);
      }
    }
  }, [accounts, selectedAccountId, setValue, limitData]);

  const onSubmit = async (_data: DailyLimitFormData) => {
    try {
      // TODO: Implementar a atualização do limite diário via API
      // Temporary placeholder - will be implemented with API integration

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating daily limit:', error);
    }
  };

  if (loadingAccounts || loadingLimit) {
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
          <Text color="gray.600">Você precisa criar uma conta primeira.</Text>
          <Button onClick={onCancel}>Voltar</Button>
        </Stack>
      </Center>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const currentLimit = limitData?.totalDailyLimit || 100.50;
  const spentToday = limitData?.totalSpentToday || 45.25;
  const remaining = limitData?.totalRemaining || 55.25;
  const percentageUsed = limitData?.percentageUsed || 45.02;

  // Calcular o valor do stroke-dasharray para o círculo
  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentageUsed / 100) * circumference;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={0} align="stretch" minH="100vh" pb={8}>
        {/* Valor em destaque no header verde */}
        <Box mb={6}>
          {isEditingLimit ? (
            <Input
              type="number"
              step="0.01"
              autoFocus
              defaultValue={newLimit || currentLimit}
              fontSize="4xl"
              fontWeight="bold"
              color="var(--primary-foreground)"
              bg="transparent"
              border="none"
              borderBottom="2px solid var(--primary-foreground)"
              borderRadius="0"
              p={0}
              mb={4}
              onBlur={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setValue('newLimit', value);
                setIsEditingLimit(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = parseFloat((e.target as HTMLInputElement).value) || 0;
                  setValue('newLimit', value);
                  setIsEditingLimit(false);
                }
              }}
              css={{
                '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                  display: 'none',
                },
              }}
            />
          ) : (
            <Text
              fontSize="4xl"
              fontWeight="bold"
              color="var(--primary-foreground)"
              mb={4}
              cursor="pointer"
              onClick={() => setIsEditingLimit(true)}
              _hover={{ opacity: 0.8 }}
            >
              {formatCurrency(newLimit || currentLimit)}
            </Text>
          )}

          {/* Dropdown de Conta Customizado */}
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
                </Box>
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
                {/* Cabeçalho do Menu */}
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

                {/* Lista de Contas */}
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

        {/* Card branco com conteúdo */}
        <Box
          bg="var(--card)"
          borderRadius="2xl"
          p={6}
          shadow="md"
          mt={4}
          mb={8}
        >
          <VStack gap={6} align="stretch">
            {/* Gráfico circular com informações */}
            <VStack gap={4} align="stretch">
              {/* Gráfico circular */}
              <Center>
                <Box position="relative" w="150px" h="150px">
                  <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Círculo de fundo */}
                    <circle
                      cx="75"
                      cy="75"
                      r={circleRadius}
                      stroke="#f0f0f0"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Círculo de progresso */}
                    <circle
                      cx="75"
                      cy="75"
                      r={circleRadius}
                      stroke="var(--primary)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{
                        transition: 'stroke-dashoffset 0.5s ease-in-out',
                      }}
                    />
                  </svg>
                  {/* Texto central */}
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    textAlign="center"
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="var(--card-foreground)"
                      lineHeight="1"
                    >
                      {percentageUsed.toFixed(1)}%
                    </Text>
                    <Text
                      fontSize="xs"
                      color="var(--muted-foreground)"
                      mt={1}
                    >
                      Usado
                    </Text>
                  </Box>
                </Box>
              </Center>

              {/* Valores em duas colunas */}
              <HStack justify="space-between" gap={6}>
                <VStack align="center" flex="1">
                  <Text fontSize="sm" color="var(--muted-foreground)">
                    Gasto Hoje
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="var(--card-foreground)">
                    {formatCurrency(spentToday)}
                  </Text>
                </VStack>

                <VStack align="center" flex="1">
                  <Text fontSize="sm" color="var(--muted-foreground)">
                    Restante
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="var(--primary)">
                    {formatCurrency(remaining)}
                  </Text>
                </VStack>
              </HStack>
            </VStack>

            {/* Campo Valor oculto para validação */}
            <Box position="absolute" opacity={0} pointerEvents="none" height={0} overflow="hidden">
              <Input
                type="number"
                step="0.01"
                {...register('newLimit', { valueAsNumber: true })}
              />
            </Box>

            {/* Mensagem de erro do valor */}
            {errors.newLimit && (
              <Box
                bg="red.50"
                borderWidth="1px"
                borderColor="red.200"
                borderRadius="lg"
                p={3}
              >
                <Text fontSize="sm" color="red.600">{errors.newLimit.message}</Text>
              </Box>
            )}

            {/* Box informativo verde */}
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
                  Como funciona:
                </Text>
              </HStack>
              <VStack gap={2} align="stretch" fontSize="sm" color="muted.fg">
                <HStack gap={2}>
                  <Check size={16} color={iconColors.brandDark} />
                  <Text>O limite é <strong>calculado automaticamente</strong> baseado na sua renda</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color={iconColors.brandDark} />
                  <Text>Você pode <strong>ajustar manualmente</strong> conforme sua necessidade</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color={iconColors.brandDark} />
                  <Text>O sistema te alerta quando estiver próximo do limite</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Botão verde grande */}
            <Button
              type="submit"
              loading={isSubmitting}
              w="full"
              size="lg"
              bg="var(--primary)"
              color="var(--primary-foreground)"
              borderRadius="full"
              _hover={{ opacity: 0.9 }}
              mt={4}
            >
              Atualizar Limite
            </Button>

            {/* Link Cancelar */}
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
                pb={4}
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