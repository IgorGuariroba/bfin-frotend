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
}

export const CalendarPopover: React.FC<CalendarPopoverProps> = ({
  date,
  events,
  isOpen,
  onClose,
  onEventClick
}) => {
  const formattedDate = format(date, "d 'de' MMMM, yyyy", { locale: ptBR })

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <HStack justifyContent="space-between" alignItems="center">
              <Dialog.Title>Eventos de {formattedDate}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <Button variant="ghost" size="md" onClick={onClose}>
                  <X size={20} />
                </Button>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={3} align="stretch">
              {events.length === 0 ? (
                <Text color="fg.muted" textAlign="center" py={4}>
                  Nenhum evento para este dia.
                </Text>
              ) : (
                events.map((event) => (
                  <Box
                    key={event.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="border.muted"
                    _hover={{ bg: 'bg.muted', cursor: onEventClick ? 'pointer' : 'default' }}
                    onClick={() => onEventClick?.(event)}
                  >
                    <HStack justifyContent="space-between" mb={1}>
                      <Badge
                        colorPalette={
                          event.type === 'income' ? 'green' :
                          event.type === 'fixed_expense' ? 'red' : 'orange'
                        }
                        variant="solid"
                      >
                        {event.type === 'income' ? 'Receita' :
                         event.type === 'fixed_expense' ? 'Fixa' : 'Variável'}
                      </Badge>
                      <Badge
                        variant="outline"
                        colorPalette={
                          event.status === 'paid' ? 'green' :
                          event.status === 'overdue' ? 'red' : 'yellow'
                        }
                      >
                        {event.status === 'paid' ? 'Pago' :
                         event.status === 'overdue' ? 'Vencido' : 'Pendente'}
                      </Badge>
                    </HStack>
                    <HStack justifyContent="space-between" mt={2}>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="medium">{event.description}</Text>
                        <Text fontSize="xs" color="fg.muted">{event.category}</Text>
                      </VStack>
                      <HStack>
                        <Text fontWeight="bold">
                          R$ {event.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Text>
                        {onEventClick && <ChevronRight size={16} />}
                      </HStack>
                    </HStack>
                  </Box>
                ))
              )}
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" size="md" onClick={onClose}>Fechar</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
