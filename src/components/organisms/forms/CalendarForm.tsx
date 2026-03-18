import { Box } from '@chakra-ui/react';
import { Calendar } from '../Calendar';
import type { CalendarEvent } from '@/types/calendar';

export function CalendarForm() {
  const handleDateSelect = (_date: Date, _events: CalendarEvent[]) => {
    // console.log('Data selecionada:', date, 'Eventos:', events)
  }

  const handleEventClick = (_event: CalendarEvent) => {
    // console.log('Evento clicado:', event)
  }

  return (
    <Box
      width="100%"
      maxWidth={{ base: 'calc(100vw - 16px)', md: '600px', lg: '700px' }}
      mx="auto"
      px={{ base: 2, md: 4 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Calendar
        onDateSelect={handleDateSelect}
        onEventClick={handleEventClick}
        showFilters={true}
        compact={false}
        height="calc(100vh - 120px)"
      />
    </Box>
  );
}
