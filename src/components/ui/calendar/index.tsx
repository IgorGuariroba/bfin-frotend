"use client"

import { forwardRef } from 'react'
import { Box, Grid, Button, Text, VStack } from '@chakra-ui/react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, getDay, addDays, subDays } from 'date-fns'
import type { CalendarComponentProps } from '@/types/calendar'

// Temporary compatibility interface to maintain existing API
export interface ChakraCalendarProps extends CalendarComponentProps {
  variant?: 'default' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  mode?: 'single' | 'multiple' | 'range'
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  month?: Date
  onMonthChange?: (date: Date) => void
  disabled?: boolean
  opacity?: number | string
  bg?: string
  backgroundColor?: string
  components?: {
    Day?: React.ComponentType<{
      date: Date;
      selected?: boolean;
      today?: boolean;
      outside?: boolean;
      onClick?: () => void;
    }>
  }
  fixedWeeks?: boolean
  showOutsideDays?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export const ChakraCalendar = forwardRef<HTMLDivElement, ChakraCalendarProps>(
  ({
    variant = 'default', // eslint-disable-line @typescript-eslint/no-unused-vars
    size = 'md',
    compact, // eslint-disable-line @typescript-eslint/no-unused-vars
    mode = 'single', // eslint-disable-line @typescript-eslint/no-unused-vars
    selected,
    onSelect,
    month = new Date(),
    disabled,
    opacity = 1,
    bg,
    backgroundColor,
    components,
    fixedWeeks = true,
    showOutsideDays = true,
    weekStartsOn = 0, // Sunday
    ...props
  }, ref) => {

    // Generate calendar days
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    const calendarStart = subDays(monthStart, getDay(monthStart) - weekStartsOn)

    let calendarEnd = addDays(monthEnd, 6 - getDay(monthEnd) + weekStartsOn)
    if (getDay(monthEnd) === weekStartsOn - 1) {
      calendarEnd = addDays(calendarEnd, 7)
    }

    // If fixedWeeks is true, ensure we always have 6 weeks
    if (fixedWeeks) {
      const weeks = Math.ceil((calendarEnd.getTime() - calendarStart.getTime()) / (7 * 24 * 60 * 60 * 1000))
      if (weeks < 6) {
        calendarEnd = addDays(calendarEnd, (6 - weeks) * 7)
      }
    }

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    const handleDayClick = (date: Date) => {
      if (disabled) return
      onSelect?.(date)
    }

    const isSelected = (date: Date) => {
      if (!selected) return false
      if (selected instanceof Date) {
        return isSameDay(date, selected)
      }
      if (Array.isArray(selected)) {
        return selected.some(s => isSameDay(date, s))
      }
      return false
    }

    const cellSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'
    const fontSize = size === 'sm' ? 'sm' : 'md'

    // Custom Day component wrapper
    const DayComponent = components?.Day

    return (
      <VStack
        ref={ref}
        gap={2}
        opacity={opacity}
        pointerEvents={disabled ? 'none' : 'auto'}
        bg={bg || backgroundColor}
        borderRadius="md"
        p={bg || backgroundColor ? 4 : 0}
        w="100%"
        maxW="100%"
        {...props}
      >
        {/* Week headers */}
        <Grid templateColumns="repeat(7, 1fr)" gap={1} w="full">
          {weekDays.map((day) => (
            <Text
              key={day}
              textAlign="center"
              fontSize="xs"
              fontWeight="semibold"
              color="fg.muted"
              py={2}
            >
              {day}
            </Text>
          ))}
        </Grid>

        {/* Calendar grid */}
        <Grid templateColumns="repeat(7, 1fr)" gap={1} w="full">
          {calendarDays.map((date) => {
            const isOutside = !isSameMonth(date, month)
            const isSelectedDay = isSelected(date)
            const isTodayDay = isToday(date)

            // Use custom Day component if provided
            if (DayComponent) {
              return (
                <Box key={date.toISOString()}>
                  <DayComponent
                    date={date}
                    selected={isSelectedDay}
                    today={isTodayDay}
                    outside={isOutside}
                    onClick={() => handleDayClick(date)}
                  />
                </Box>
              )
            }

            return (
              <Button
                key={date.toISOString()}
                variant={isSelectedDay ? 'solid' : 'ghost'}
                colorPalette={isSelectedDay ? 'blue' : 'gray'}
                size={cellSize}
                fontSize={fontSize}
                onClick={() => handleDayClick(date)}
                opacity={
                  isOutside && !showOutsideDays ? 0 :
                  isOutside ? 0.4 : 1
                }
                fontWeight={isTodayDay ? 'bold' : 'normal'}
                bg={
                  isSelectedDay ? 'blue.500' :
                  isTodayDay ? 'blue.100' :
                  'transparent'
                }
                color={
                  isSelectedDay ? 'white' :
                  isTodayDay ? 'blue.700' :
                  isOutside ? 'fg.muted' : 'fg'
                }
                _hover={{
                  bg: isSelectedDay ? 'blue.600' : 'gray.100'
                }}
              >
                {format(date, 'd')}
              </Button>
            )
          })}
        </Grid>
      </VStack>
    )
  }
)

ChakraCalendar.displayName = 'ChakraCalendar'

// Re-export for new implementations
export { DatePicker } from '@chakra-ui/react'
export type { DateValue } from '@internationalized/date'
