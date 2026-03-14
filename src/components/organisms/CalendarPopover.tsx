import React from 'react'
import {
  Dialog,
  VStack,
  Text,
  Badge,
  Box,
  HStack,
  Button,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarEvent } from '@/types/calendar'
import { ChevronRight, X } from 'lucide-react'

interface CalendarPopoverProps {
  date: Date
  events: CalendarEvent[]
  isOpen: boolean
  onClose: () => void
  onEventClick?: (event: CalendarEvent) => void
  onMarkAsPaid?: (transactionId: string) => void
}

export const CalendarPopover: React.FC<CalendarPopoverProps> = ({
  date,
  events,
  isOpen,
  onClose,
  onEventClick,
  onMarkAsPaid
}) => {
  const formattedDate = format(date, "d 'de' MMMM, yyyy", { locale: ptBR })

  const typeBadgeMap = {
    income: { label: 'Receita', bg: 'var(--success)', color: 'var(--success-foreground)' },
    fixed: { label: 'Fixa', bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
    variable: { label: 'Variável', bg: 'var(--warning)', color: 'var(--warning-foreground)' },
  } as const

  const statusBadgeMap = {
    paid: { label: 'Pago', bg: 'var(--success)', color: 'var(--success-foreground)' },
    pending: { label: 'Pendente', bg: 'var(--warning)', color: 'var(--warning-foreground)' },
    overdue: { label: 'Vencido', bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
  } as const

  const secondaryButtonStyles = {
    bg: 'var(--secondary)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
    _hover: { bg: 'var(--accent)' },
    _active: { bg: 'var(--secondary)' },
    _focusVisible: { boxShadow: '0 0 0 2px var(--ring)' },
    _disabled: {
      bg: 'var(--accent)',
      color: 'var(--muted-foreground)',
      borderColor: 'var(--border)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          bg="var(--card)"
          color="var(--foreground)"
          borderRadius="xl"
          border="1px solid var(--border)"
          boxShadow="var(--shadow-lg)"
        >
          <Dialog.Header>
            <HStack justifyContent="space-between" alignItems="center">
              <Dialog.Title>Eventos de {formattedDate}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={onClose}
                  color="var(--muted-foreground)"
                  _hover={{ bg: 'var(--accent)', color: 'var(--foreground)' }}
                  _focusVisible={{ boxShadow: '0 0 0 2px var(--ring)' }}
                >
                  <X size={20} />
                </Button>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={3} align="stretch">
              {events.length === 0 ? (
                <Text color="var(--muted-foreground)" textAlign="center" py={4}>
                  Nenhum evento para este dia.
                </Text>
              ) : (
                events.map((event) => (
                  <Box
                    key={event.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="var(--border)"
                    bg="var(--secondary)"
                    _hover={{ bg: 'var(--accent)', cursor: onEventClick ? 'pointer' : 'default' }}
                    onClick={() => onEventClick?.(event)}
                  >
                    <HStack justifyContent="space-between" mb={1}>
                      <Badge
                        variant="solid"
                        bg={typeBadgeMap[event.type]?.bg || 'var(--muted)'}
                        color={typeBadgeMap[event.type]?.color || 'var(--muted-foreground)'}
                        borderRadius="full"
                      >
                        {typeBadgeMap[event.type]?.label || event.type}
                      </Badge>
                      <Badge
                        variant="solid"
                        bg={statusBadgeMap[event.status]?.bg || 'var(--muted)'}
                        color={statusBadgeMap[event.status]?.color || 'var(--muted-foreground)'}
                        borderRadius="full"
                      >
                        {statusBadgeMap[event.status]?.label || event.status}
                      </Badge>
                    </HStack>
                    <HStack justifyContent="space-between" mt={2}>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="medium">{event.description}</Text>
                        <Text fontSize="xs" color="var(--muted-foreground)">{event.category}</Text>
                      </VStack>
                      <HStack>
                        <Text fontWeight="bold">
                          R$ {event.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Text>
                        {onEventClick && <ChevronRight size={16} />}
                      </HStack>
                    </HStack>
                    
                    {/* Botão Pagar - aparece apenas para despesas pendentes/vencidas */}
                    {(event.status === 'pending' || event.status === 'overdue') && (
                      <Button
                        size="sm"
                        colorPalette="green"
                        mt={2}
                        w="full"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (event.transaction.id) {
                            onMarkAsPaid?.(event.transaction.id);
                          }
                        }}
                      >
                        Pagar
                      </Button>
                    )}
                  </Box>
                ))
              )}
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button size="md" onClick={onClose} {...secondaryButtonStyles}>Fechar</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
