// src/components/atoms/EventDot.tsx

import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import type { CalendarEventColor } from '@/types/calendar'
import { getEventColorValue } from '@/components/ui/calendar/calendar-theme'

interface EventDotProps {
  color: CalendarEventColor
  count: number
  size?: 'sm' | 'md' | 'lg'
}

export const EventDot: React.FC<EventDotProps> = ({
  color,
  count,
  size = 'md'
}) => {
  const colorValue = getEventColorValue(color)

  const sizeProps = {
    sm: { w: '4px', h: '4px', fontSize: '6px' },
    md: { w: '6px', h: '6px', fontSize: '8px' },
    lg: { w: '8px', h: '8px', fontSize: '10px' },
  }[size]

  // Se há múltiplos eventos, mostra um badge com número
  if (count > 1) {
    return (
      <Box
        position="absolute"
        top="1px"
        right="1px"
        bg={colorValue}
        color="white"
        borderRadius="full"
        minW="12px"
        h="12px"
        fontSize="8px"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px="2px"
        data-testid="event-badge"
        aria-label={`${count} eventos`}
      >
        <Text>{count > 9 ? '9+' : count}</Text>
      </Box>
    )
  }

  // Evento único, mostra apenas o ponto
  return (
    <Box
      position="absolute"
      top="2px"
      right="2px"
      {...sizeProps}
      bg={colorValue}
      borderRadius="full"
      data-testid="event-dot"
      aria-label="1 evento"
    />
  )
}