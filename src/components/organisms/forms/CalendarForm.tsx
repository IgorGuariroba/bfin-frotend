import { useState } from 'react';
import { Box, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import { Button } from '../../atoms/Button';
import { Calendar } from '../Calendar';
import { useCalendar } from '@/hooks/useCalendar';
import { useCalendarTotals } from '@/hooks/useCalendarTotals';
import { CalendarPopover } from '../CalendarPopover';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Calendar as CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CalendarEvent } from '@/types/calendar';

export function CalendarForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const calendar = useCalendar(new Date(), {});
  const { totals } = useCalendarTotals(calendar.events);

  const {
    getDayEvents,
    markAsPaid,
  } = calendar;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getStatusBadge = (status: CalendarEvent['status']) => {
    const statusMap = {
      paid: { label: 'Pago', bg: 'var(--success)', color: 'var(--success-foreground)' },
      pending: { label: 'Pendente', bg: 'var(--warning)', color: 'var(--warning-foreground)' },
      overdue: { label: 'Vencido', bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
    };

    return statusMap[status];
  };

  return (
    <VStack gap={4} align="stretch">
      {/* Cards de Resumo */}
      <HStack gap={3} wrap="wrap">
        {/* A Pagar */}
        <Box
          flex="1"
          minW="140px"
          bg="var(--card)"
          borderRadius="xl"
          p={3}
          shadow="md"
          borderWidth="1px"
          borderColor="var(--border)"
        >
          <HStack gap={2} mb={1}>
            <TrendingDown size={16} color="var(--destructive)" />
            <Text fontSize="xs" color="var(--muted-foreground)" fontWeight="medium">
              A Pagar
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="bold" color="var(--destructive)">
            {formatCurrency(totals.toPay)}
          </Text>
        </Box>

        {/* A Receber */}
        <Box
          flex="1"
          minW="140px"
          bg="var(--card)"
          borderRadius="xl"
          p={3}
          shadow="md"
          borderWidth="1px"
          borderColor="var(--border)"
        >
          <HStack gap={2} mb={1}>
            <TrendingUp size={16} color="var(--success)" />
            <Text fontSize="xs" color="var(--muted-foreground)" fontWeight="medium">
              A Receber
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="bold" color="var(--success)">
            {formatCurrency(totals.toReceive)}
          </Text>
        </Box>

        {/* Pago */}
        <Box
          flex="1"
          minW="140px"
          bg="var(--card)"
          borderRadius="xl"
          p={3}
          shadow="md"
          borderWidth="1px"
          borderColor="var(--border)"
        >
          <HStack gap={2} mb={1}>
            <CheckCircle2 size={16} color="var(--primary)" />
            <Text fontSize="xs" color="var(--muted-foreground)" fontWeight="medium">
              Pago
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="bold" color="var(--primary)">
            {formatCurrency(totals.paid)}
          </Text>
        </Box>

        {/* Vencidos */}
        <Box
          flex="1"
          minW="140px"
          bg="var(--card)"
          borderRadius="xl"
          p={3}
          shadow="md"
          borderWidth="1px"
          borderColor="var(--border)"
        >
          <HStack gap={2} mb={1}>
            <AlertCircle size={16} color="var(--warning)" />
            <Text fontSize="xs" color="var(--muted-foreground)" fontWeight="medium">
              Vencidos
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="bold" color="var(--warning)">
            {formatCurrency(totals.overdue)}
          </Text>
        </Box>
      </HStack>

      {/* Layout em 2 colunas no desktop, 1 no mobile */}
      <HStack
        gap={4}
        align="start"
        w="full"
        flex="1"
        wrap="wrap"
      >
        {/* Coluna do Calendário */}
        <Box flex="2" minW="280px">
          <Calendar
            showFilters={true}
            compact={false}
            height="auto"
            onDateSelect={handleDateSelect}
          />
        </Box>

        {/* Coluna de Detalhes do Dia */}
        <Box flex="1" minW="280px" w="full" maxW="400px">
          <Box
            bg="var(--card)"
            borderRadius="xl"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderColor="var(--border)"
            minH="400px"
          >
            <VStack gap={3} align="stretch">
              {/* Header */}
              <HStack justify="space-between">
                <HStack gap={2}>
                  <CalendarIcon size={18} color="var(--muted-foreground)" />
                  <Text fontSize="sm" fontWeight="semibold" color="var(--card-foreground)">
                    {selectedDate 
                      ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                      : 'Selecione um dia'}
                  </Text>
                </HStack>
                {selectedDate && (
                  <Badge
                    size="sm"
                    variant="subtle"
                    colorPalette="gray"
                    onClick={() => setSelectedDate(null)}
                    cursor="pointer"
                  >
                    Limpar
                  </Badge>
                )}
              </HStack>

              {/* Conteúdo */}
              {!selectedDate ? (
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  py={8}
                >
                  <VStack gap={3} textAlign="center">
                    <CalendarIcon size={48} color="var(--muted-foreground)" opacity={0.3} />
                    <Text fontSize="sm" color="var(--muted-foreground)">
                      Selecione um dia no calendário<br />para ver os detalhes
                    </Text>
                  </VStack>
                </Box>
              ) : (
                <>
                  {getDayEvents(selectedDate).length === 0 ? (
                    <Box
                      flex="1"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      py={8}
                    >
                      <VStack gap={3} textAlign="center">
                        <Info size={48} color="var(--muted-foreground)" opacity={0.3} />
                        <Text fontSize="sm" color="var(--muted-foreground)">
                          Nenhuma transação<br />para este dia
                        </Text>
                      </VStack>
                    </Box>
                  ) : (
                    <VStack gap={2} align="stretch" overflow="auto" maxH="400px">
                      {getDayEvents(selectedDate).map((event) => {
                        const statusInfo = getStatusBadge(event.status);
                        const canPay = event.status === 'pending' || event.status === 'overdue';

                        return (
                          <Box
                            key={event.id}
                            p={3}
                            bg="var(--secondary)"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="var(--border)"
                          >
                            <VStack gap={2} align="stretch">
                              <HStack justify="space-between">
                                <VStack align="start" gap={1} flex="1">
                                  <HStack>
                                    <Badge
                                      size="sm"
                                      variant="solid"
                                      bg={statusInfo.bg}
                                      color={statusInfo.color}
                                      borderRadius="full"
                                    >
                                      {statusInfo.label}
                                    </Badge>
                                    {event.isRecurring && (
                                      <Text fontSize="xs" color="var(--muted-foreground)">
                                        Recorrente
                                      </Text>
                                    )}
                                  </HStack>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="var(--card-foreground)"
                                  >
                                    {event.description}
                                  </Text>
                                  <Text fontSize="xs" color="var(--muted-foreground)">
                                    {event.category}
                                  </Text>
                                </VStack>

                                <Text
                                  fontSize="sm"
                                  fontWeight="bold"
                                  color={event.type === 'income' ? 'var(--success)' : 'var(--destructive)'}
                                >
                                  {event.type === 'income' ? '+' : '-'} {formatCurrency(event.amount)}
                                </Text>
                              </HStack>

                              {/* Botão Pagar */}
                              {canPay && event.type !== 'income' && (
                                <Box
                                  w="full"
                                  display="flex"
                                  gap={2}
                                >
                                  <DollarSign size={14} color="var(--muted-foreground)" />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    colorPalette="green"
                                    flex="1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (event.transaction.id) {
                                        markAsPaid(event.transaction.id);
                                      }
                                    }}
                                  >
                                    Marcar como Pago
                                  </Button>
                                </Box>
                              )}
                            </VStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  )}
                </>
              )}
            </VStack>
          </Box>
        </Box>
      </HStack>

      {/* Popover de detalhes (mobile) */}
      {selectedDate && (
        <CalendarPopover
          date={selectedDate}
          events={getDayEvents(selectedDate)}
          isOpen={Boolean(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onEventClick={undefined}
          onMarkAsPaid={markAsPaid}
        />
      )}
    </VStack>
  );
}
