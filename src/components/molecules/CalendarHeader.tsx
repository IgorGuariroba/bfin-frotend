import React from 'react'
import {
  HStack,
  Button,
  Text,
  IconButton,
  Spacer
} from '@chakra-ui/react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  isLoading?: boolean
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  isLoading = false,
}) => {
  const monthYear = format(currentDate, 'MMMM yyyy', { locale: ptBR })
  const isCurrentMonth = format(currentDate, 'MM/yyyy') === format(new Date(), 'MM/yyyy')

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
    <HStack gap={2} mb={4} width="100%">
      <IconButton
        size="sm"
        onClick={onPrevMonth}
        disabled={isLoading}
        aria-label="Mês anterior"
        {...secondaryButtonStyles}
      >
        <ChevronLeft size={16} />
      </IconButton>

      <Text
        fontSize="lg"
        fontWeight="semibold"
        textTransform="capitalize"
        minW="140px"
        textAlign="center"
        color="var(--foreground)"
      >
        {monthYear}
      </Text>

      <IconButton
        size="sm"
        onClick={onNextMonth}
        disabled={isLoading}
        aria-label="Próximo mês"
        {...secondaryButtonStyles}
      >
        <ChevronRight size={16} />
      </IconButton>

      <Spacer />

      {!isCurrentMonth && (
        <Button
          size="md"
          onClick={onToday}
          disabled={isLoading}
          {...secondaryButtonStyles}
        >
          <CalendarIcon size={16} style={{ marginRight: '8px' }} />
          Hoje
        </Button>
      )}
    </HStack>
  )
}
