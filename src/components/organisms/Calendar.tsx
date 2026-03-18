import React, { useState } from 'react'
import {
  VStack,
  Box,
  Skeleton,
  Collapsible,
  Button,
} from '@chakra-ui/react'
import { Filter } from 'lucide-react'
import { format } from 'date-fns'
import { ChakraCalendar } from '@/components/ui/calendar'
import { CalendarHeader } from '@/components/molecules/CalendarHeader'
import { CalendarFilters } from '@/components/molecules/CalendarFilters'
import { CalendarPopover } from './CalendarPopover'
import { CalendarDay } from '@/components/atoms/CalendarDay'
import { useCalendar } from '@/hooks/useCalendar'
import type { CalendarComponentProps } from '@/types/calendar'

export const Calendar: React.FC<CalendarComponentProps> = ({
  initialDate,
  initialFilters,
  onDateSelect,
  onEventClick,
  compact = false,
  showFilters = true,
  height,
}) => {
  // Using Collapsible for filters
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  const calendar = useCalendar(initialDate, initialFilters)

  const {
    currentDate,
    selectedDate,
    filters,
    isLoading,
    error,
    setSelectedDate,
    setFilters,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    getDayEvents,
    markAsPaid,
  } = calendar

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

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    const events = getDayEvents(date)
    onDateSelect?.(date, events)
  }

  if (error) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderColor="var(--destructive)"
        borderRadius="md"
        bg="var(--accent)"
        color="var(--destructive)"
      >
        <p>Erro ao carregar eventos. Tente novamente.</p>
      </Box>
    )
  }

  return (
    <VStack gap={{ base: 2, md: 4 }} align="center" h={height} w="100%">
      {/* Cabeçalho */}
      <Box maxW={{ base: '100%', md: '500px', lg: '600px' }} w="100%">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
          isLoading={isLoading}
        />
      </Box>

      {/* Toggle de Filtros */}
      {showFilters && (
        <Box maxW={{ base: '100%', md: '500px', lg: '600px' }} w="100%">
          <Collapsible.Root open={showFiltersPanel} onOpenChange={(e) => setShowFiltersPanel(e.open)}>
            <Collapsible.Trigger asChild>
              <Button
                size="md"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                alignSelf="flex-start"
                {...secondaryButtonStyles}
              >
                <Filter size={16} style={{ marginRight: '8px' }} />
                Filtros
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>
               <Box
                 p={4}
                 bg="var(--secondary)"
                 borderRadius="md"
                 borderWidth="1px"
                 borderColor="var(--border)"
                 mt={2}
               >
                <CalendarFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  compact={compact}
                />
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        </Box>
      )}

      {/* Calendário */}
      <Box position="relative" flex="1" maxW={{ base: '100%', md: '500px', lg: '600px' }} mx="auto" w="100%">
        {isLoading && (
          <Skeleton
            height="300px"
            borderRadius="md"
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={1}
          />
        )}

        <ChakraCalendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(date) => setSelectedDate(date ?? null)}
          month={currentDate}
          onMonthChange={() => {}} // Controlado pelo header
          variant={compact ? 'compact' : 'default'}
          size={compact ? 'sm' : 'md'}
          bg="white"
          components={{
            Day: ({ date, ...props }) => (
              <CalendarDay
                date={date}
                events={getDayEvents(date)}
                isSelected={selectedDate ? format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') : false}
                currentMonthDate={currentDate}
                onClick={handleDayClick}
                size={compact ? 'sm' : 'md'}
                {...props}
              />
            ),
          }}
          disabled={isLoading}
          opacity={isLoading ? 0.5 : 1}
        />
      </Box>

      {/* Popover de Detalhes */}
      {selectedDate && (
        <CalendarPopover
          date={selectedDate}
          events={getDayEvents(selectedDate)}
          isOpen={Boolean(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onEventClick={onEventClick}
          onMarkAsPaid={markAsPaid}
        />
      )}
    </VStack>
  )
}
