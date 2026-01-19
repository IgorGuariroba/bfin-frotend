import React from 'react'
import {
  Container,
  VStack,
  Heading,
  Box,
  Text
} from '@chakra-ui/react'
import { Calendar } from '@/components/organisms/Calendar'
import type { CalendarEvent } from '@/types/calendar'

export const CalendarPage: React.FC = () => {
  const handleDateSelect = (_date: Date, _events: CalendarEvent[]) => {
    // console.log('Data selecionada:', date, 'Eventos:', events)
  }

  const handleEventClick = (_event: CalendarEvent) => {
    // console.log('Evento clicado:', event)
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Calendário de Contas BFIN
          </Heading>
          <Text color="fg.muted">
            Visualize suas receitas e despesas organizadas por data de vencimento.
          </Text>
        </Box>

        <Box
          bg="var(--card)"
          borderRadius="xl"
          p={6}
          shadow="md"
        >
          <Calendar
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            showFilters={true}
            compact={false}
          />
        </Box>
      </VStack>
    </Container>
  )
}

export default CalendarPage