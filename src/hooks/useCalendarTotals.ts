import { useMemo } from 'react'
import type { CalendarEvent } from '@/types/calendar'

interface UseCalendarTotalsReturn {
  totals: {
    toPay: number
    toReceive: number
    paid: number
    overdue: number
  }
}

export function useCalendarTotals(events: CalendarEvent[]): UseCalendarTotalsReturn {
  const totals = useMemo(() => {
    return events.reduce(
      (acc, event) => {
        const amount = Math.abs(event.amount)

        if (event.type === 'income') {
          if (event.status === 'paid') {
            acc.paid += amount
          } else {
            acc.toReceive += amount
          }
        } else {
          // expense
          if (event.status === 'paid') {
            acc.paid += amount
          } else if (event.status === 'overdue') {
            acc.overdue += amount
          } else {
            acc.toPay += amount
          }
        }

        return acc
      },
      { toPay: 0, toReceive: 0, paid: 0, overdue: 0 }
    )
  }, [events])

  return {
    totals,
  }
}
