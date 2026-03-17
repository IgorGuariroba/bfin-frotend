import { useState, useEffect } from 'react';
import {
  HStack,
  VStack,
  Center,
  Text,
  Box,
  Menu,
} from '@chakra-ui/react';
import { BaseForm } from '../../ui/BaseForm';
import { useAccounts } from '../../../hooks/useAccounts';
import { useDailyLimit } from '../../../hooks/useDailyLimit';
import { ChevronDown, Check, Zap, Info, Calendar, DollarSign, Target } from 'lucide-react';
import { iconColors } from '../../../theme';

interface DailyLimitFormRefactoredProps {
  onCancel?: () => void;
}

export function DailyLimitFormRefactored({ onCancel }: DailyLimitFormRefactoredProps) {
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

  if (!accounts || accounts.length === 0) {
    return (
      <BaseForm
        title="Limite Diário"
        variant="green-header"
        icon={Target}
        error="Você precisa criar uma conta primeiro."
        primaryAction={{
          label: 'Voltar',
          onClick: onCancel || (() => {}),
        }}
      >
      </BaseForm>
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

  // Usar dados reais do limitData
  const dailyLimit = limitData?.dailyLimit || 0;
  const availableBalance = limitData?.availableBalance || 0;
  const daysConsidered = limitData?.daysConsidered || 0;
  const spentToday = limitData?.spentToday || 0;
  const remaining = limitData?.remaining || 0;
  const percentageUsed = limitData?.percentageUsed || 0;
  const exceeded = limitData?.exceeded || false;
  const calculatedAt = limitData?.calculatedAt || new Date().toISOString();

  // Calcular o valor do stroke-dasharray para o círculo
  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentageUsed / 100) * circumference;

  return (
    <BaseForm
      title="Limite Diário"
      subtitle="Gerencie seus gastos diários"
      icon={Target}
      variant="green-header"
      onBack={onCancel}
      isLoading={loadingAccounts || loadingLimit}
      displayValue={{
        value: formatCurrency(dailyLimit),
        label: "Limite calculado automaticamente"
      }}
      primaryAction={{
        label: 'Voltar',
        onClick: onCancel || (() => {}),
        variant: 'outline'
      }}
    >
      <Box px={{ base: 4, md: 6 }}>
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
              mb={6}
              fontSize="md"
              fontWeight="medium"
              color="var(--card-foreground)"
              bg="var(--card)"
              borderWidth="1px"
              borderColor="var(--border)"
              borderRadius="lg"
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
            >
              {accounts?.map((account) => (
                <Menu.Item
                  key={account.id ?? ''}
                  value={account.id ?? ''}
                  onClick={() => setSelectedAccountId(account.id ?? '')}
                  px={3}
                  py={2}
                  borderRadius="md"
                  cursor="pointer"
                  bg={selectedAccountId === account.id ? 'var(--muted)' : 'transparent'}
                  _hover={{
                    bg: 'var(--muted)',
                  }}
                >
                  <HStack justify="space-between" w="full">
                    <VStack align="flex-start" gap={0}>
                      <Text fontWeight="medium" color="var(--card-foreground)">
                        {account.account_name}
                      </Text>
                      <Text fontSize="sm" color="var(--muted-foreground)">
                        {formatCurrency(Number(account.available_balance))}
                      </Text>
                    </VStack>
                    {selectedAccountId === account.id && (
                      <Check size={16} color={iconColors.success} />
                    )}
                  </HStack>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>

        {/* Card com informações do limite */}
        <Box
          bg="var(--card)"
          borderRadius="xl"
          p={6}
          shadow="md"
          mb={6}
        >
          {/* Gráfico circular do uso */}
          <Center mb={6}>
            <Box position="relative" width="140px" height="140px">
              <svg
                width="140"
                height="140"
                style={{ transform: 'rotate(-90deg)' }}
              >
                {/* Círculo de fundo */}
                <circle
                  cx="70"
                  cy="70"
                  r={circleRadius}
                  stroke="var(--muted)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Círculo de progresso */}
                <circle
                  cx="70"
                  cy="70"
                  r={circleRadius}
                  stroke={exceeded ? "#ef4444" : "var(--primary)"}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: 'stroke-dashoffset 0.6s ease-in-out',
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
                color={exceeded ? "#ef4444" : "var(--card-foreground)"}
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
                color={exceeded ? "#ef4444" : "var(--primary)"}
              >
                {formatCurrency(remaining)}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Informações sobre o cálculo */}
        <VStack gap={4} align="stretch">
          <Box
            bg="var(--muted)"
            borderRadius="lg"
            p={4}
          >
            <HStack gap={2} mb={3}>
              <Info size={18} color="var(--primary)" />
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

          {/* Box informativo */}
          <Box
            bg="var(--success-subtle)"
            borderWidth="1px"
            borderColor="var(--success-border)"
            borderRadius="lg"
            p={4}
          >
            <HStack gap={2} mb={3}>
              <Zap size={18} color="var(--success)" />
              <Text fontWeight="semibold" color="var(--success)" fontSize="sm">
                Como funciona:
              </Text>
            </HStack>
            <VStack gap={2} align="stretch" fontSize="sm" color="var(--muted-foreground)">
              <HStack gap={2}>
                <Check size={16} color="var(--success)" />
                <Text>O limite é <Text as="span" fontWeight="bold">calculado automaticamente</Text> baseado no seu saldo disponível</Text>
              </HStack>
              <HStack gap={2}>
                <Check size={16} color="var(--success)" />
                <Text>O cálculo considera os <Text as="span" fontWeight="bold">próximos {daysConsidered} dias</Text> para otimizar seus gastos</Text>
              </HStack>
              <HStack gap={2}>
                <Check size={16} color="var(--success)" />
                <Text>O sistema te alerta quando estiver próximo do limite</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </BaseForm>
  );
}