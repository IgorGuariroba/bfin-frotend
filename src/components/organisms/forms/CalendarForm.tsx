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
    <Calendar
      onDateSelect={handleDateSelect}
      onEventClick={handleEventClick}
      showFilters={true}
      compact={false}
    />
  );
}
