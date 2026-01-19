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

  return (
    <HStack gap={2} mb={4} width="100%">
      <IconButton
        variant="outline"
        size="sm"
        onClick={onPrevMonth}
        disabled={isLoading}
        aria-label="Mês anterior"
      >
        <ChevronLeft size={16} />
      </IconButton>

      <Text
        fontSize="lg"
        fontWeight="semibold"
        textTransform="capitalize"
        minW="140px"
        textAlign="center"
      >
        {monthYear}
      </Text>

      <IconButton
        variant="outline"
        size="sm"
        onClick={onNextMonth}
        disabled={isLoading}
        aria-label="Próximo mês"
      >
        <ChevronRight size={16} />
      </IconButton>

      <Spacer />

      {!isCurrentMonth && (
        <Button
          variant="outline"
          size="md"
          onClick={onToday}
          disabled={isLoading}
        >
          <CalendarIcon size={16} style={{ marginRight: '8px' }} />
          Hoje
        </Button>
      )}
    </HStack>
  )
}
