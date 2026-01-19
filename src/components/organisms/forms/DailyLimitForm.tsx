import { useState, useEffect } from 'react';
import {
  Stack,
  HStack,
  VStack,
  Center,
  Text,
  Box,
  Menu,
} from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { useAccounts } from '../../../hooks/useAccounts';
import { useDailyLimit } from '../../../hooks/useDailyLimit';
import { ChevronDown, Check, Zap, Info, Calendar, DollarSign } from 'lucide-react';
import { iconColors } from '../../../theme';

interface DailyLimitDisplayProps {
  onCancel?: () => void;
}

export function DailyLimitForm({ onCancel }: DailyLimitDisplayProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  const { data: limitData, isLoading: loadingLimit } = useDailyLimit(selectedAccountId);
  const selectedAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  // Define a conta padrão quando as contas forem carregadas
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      const defaultAccount = accounts.find((acc) => acc.is_default) || accounts[0];
      if (defaultAccount?.id) {
        setSelectedAccountId(defaultAccount.id);
      }
    }
  }, [accounts, selectedAccountId]);

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

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Usar dados reais do limitData ou valores de exemplo baseados na estrutura fornecida
  const dailyLimit = limitData?.dailyLimit || 100.50;
  const availableBalance = limitData?.availableBalance || 3015;
  const daysConsidered = limitData?.daysConsidered || 30;
  const spentToday = limitData?.spentToday || 45.25;
  const remaining = limitData?.remaining || 55.25;
  const percentageUsed = limitData?.percentageUsed || 45.02;
  const exceeded = limitData?.exceeded || false;
  const calculatedAt = limitData?.calculatedAt || new Date().toISOString();

  // Calcular o valor do stroke-dasharray para o círculo
  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentageUsed / 100) * circumference;

  return (
    <VStack gap={0} align="stretch" minH="100vh" pb={8}>
      {/* Valor em destaque no header verde */}
      <Box mb={6}>
        <VStack gap={2} align="center">
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="var(--primary-foreground)"
          >
            {formatCurrency(dailyLimit)}
          </Text>
          <HStack gap={2} align="center">
            <Info size={16} color="var(--primary-foreground)" />
            <Text
              fontSize="sm"
              color="var(--primary-foreground)"
              opacity={0.8}
            >
              Limite calculado automaticamente
            </Text>
          </HStack>
        </VStack>

        {/* Dropdown de Conta Customizado */}
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
                  onClick={() => setSelectedAccountId(account.id ?? '')}
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
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={exceeded ? "red.500" : "var(--card-foreground)"}
                  >
                    {formatCurrency(spentToday)}
                  </Text>
                </VStack>

                <VStack align="center" flex="1">
                  <Text fontSize="sm" color="var(--muted-foreground)">
                    Restante
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={exceeded ? "red.500" : "var(--primary)"}
                  >
                    {formatCurrency(remaining)}
                  </Text>
                </VStack>
              </HStack>
            </VStack>

            {/* Informações sobre o cálculo */}
            <VStack gap={4} align="stretch">
              <Box
                bg={{ base: 'gray.50', _dark: 'gray.800' }}
                borderRadius="lg"
                p={4}
              >
                <HStack gap={2} mb={3}>
                  <Info size={18} color={iconColors.brandDark} />
                  <Text fontWeight="semibold" color="var(--card-foreground)" fontSize="sm">
                    Informações do Cálculo
                  </Text>
                </HStack>
                <VStack gap={3} align="stretch">
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <DollarSign size={16} color="var(--muted-foreground)" />
                      <Text fontSize="sm" color="var(--muted-foreground)">
                        Saldo disponível:
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium" color="var(--card-foreground)">
                      {formatCurrency(availableBalance)}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <Calendar size={16} color="var(--muted-foreground)" />
                      <Text fontSize="sm" color="var(--muted-foreground)">
                        Dias considerados:
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium" color="var(--card-foreground)">
                      {daysConsidered} dias
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="var(--muted-foreground)">
                      Calculado em:
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color="var(--card-foreground)">
                      {formatDate(calculatedAt)}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>

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
                  <Text>O limite é <strong>calculado automaticamente</strong> baseado no seu saldo disponível</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color={iconColors.brandDark} />
                  <Text>O cálculo considera os <strong>próximos {daysConsidered} dias</strong> para otimizar seus gastos</Text>
                </HStack>
                <HStack gap={2}>
                  <Check size={16} color={iconColors.brandDark} />
                  <Text>O sistema te alerta quando estiver próximo do limite</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Botão Voltar */}
            {onCancel && (
              <Button
                onClick={onCancel}
                w="full"
                size="lg"
                variant="outline"
                borderRadius="full"
                mt={4}
              >
                Voltar
              </Button>
            )}
          </VStack>
        </Box>
      </VStack>
  );
}