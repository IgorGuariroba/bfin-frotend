import React from 'react'
import {
  HStack,
  VStack,
  Button,
  Badge,
  Wrap,
  WrapItem,
  NativeSelect,
} from '@chakra-ui/react'
import { X } from 'lucide-react'
import type { CalendarFilters as Filters } from '@/types/calendar'

interface CalendarFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  compact?: boolean
  availableCategories?: Array<{ id: string; name: string }>
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFiltersChange,
  compact = false,
  availableCategories = [],
}) => {
  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  )

  const clearFilters = () => {
    onFiltersChange({})
  }

  const updateFilter = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const Container = compact ? HStack : VStack
  const inputStyles = {
    bg: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
    borderWidth: '1px',
    _hover: { boxShadow: 'var(--shadow-sm)' },
    _focusVisible: {
      borderColor: 'var(--ring)',
      boxShadow: '0 0 0 2px var(--ring)',
    },
    _disabled: {
      bg: 'var(--accent)',
      color: 'var(--muted-foreground)',
      borderColor: 'var(--border)',
      cursor: 'not-allowed',
    },
  }

  const typeBadgeMap = {
    income: { label: 'Receita', bg: 'var(--success)', color: 'var(--success-foreground)' },
    fixed_expense: { label: 'Despesa Fixa', bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
    variable_expense: { label: 'Despesa Variável', bg: 'var(--warning)', color: 'var(--warning-foreground)' },
  } as const

  const statusBadgeMap = {
    pending: { label: 'Pendente', bg: 'var(--warning)', color: 'var(--warning-foreground)' },
    paid: { label: 'Pago', bg: 'var(--success)', color: 'var(--success-foreground)' },
    overdue: { label: 'Vencido', bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
  } as const

  return (
    <Container gap={3} align="stretch" w="100%">
      {/* Filtro de Tipo */}
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          placeholder="Tipo de transação"
          value={filters.types?.[0] || ''}
          onChange={(e) => {
            const value = e.target.value
            updateFilter('types', value ? [value as NonNullable<Filters['types']>[number]] : undefined)
          }}
          {...inputStyles}
        >
          <option value="">Todos os tipos</option>
          <option value="income">Receita</option>
          <option value="fixed_expense">Despesa Fixa</option>
          <option value="variable_expense">Despesa Variável</option>
        </NativeSelect.Field>
      </NativeSelect.Root>

      {/* Filtro de Status */}
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          placeholder="Status"
          value={filters.statuses?.[0] || ''}
          onChange={(e) => {
            const value = e.target.value
            updateFilter('statuses', value ? [value as NonNullable<Filters['statuses']>[number]] : undefined)
          }}
          {...inputStyles}
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
          <option value="overdue">Vencido</option>
        </NativeSelect.Field>
      </NativeSelect.Root>

      {/* Filtro de Categoria */}
      {availableCategories.length > 0 && (
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            placeholder="Categoria"
            value={filters.categories?.[0] || ''}
            onChange={(e) => {
              const value = e.target.value
              updateFilter('categories', value ? [value] : undefined)
            }}
            {...inputStyles}
          >
            <option value="">Todas as categorias</option>
            {availableCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      )}

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <Wrap>
          {filters.types?.map(type => (
            <WrapItem key={type}>
              <Badge
                variant="solid"
                bg={typeBadgeMap[type].bg}
                color={typeBadgeMap[type].color}
                display="flex"
                alignItems="center"
                gap={1}
                borderRadius="full"
              >
                {typeBadgeMap[type].label}
                <Button
                  variant="ghost"
                  size="xs"
                  p={0}
                  minW={0}
                  h="14px"
                  onClick={() => updateFilter('types', undefined)}
                  color="currentColor"
                  _hover={{ bg: 'transparent', opacity: 0.8 }}
                >
                  <X size={10} />
                </Button>
              </Badge>
            </WrapItem>
          ))}

          {filters.statuses?.map(status => (
            <WrapItem key={status}>
              <Badge
                variant="solid"
                bg={statusBadgeMap[status].bg}
                color={statusBadgeMap[status].color}
                display="flex"
                alignItems="center"
                gap={1}
                borderRadius="full"
              >
                {statusBadgeMap[status].label}
                <Button
                  variant="ghost"
                  size="xs"
                  p={0}
                  minW={0}
                  h="14px"
                  onClick={() => updateFilter('statuses', undefined)}
                  color="currentColor"
                  _hover={{ bg: 'transparent', opacity: 0.8 }}
                >
                  <X size={10} />
                </Button>
              </Badge>
            </WrapItem>
          ))}

          <WrapItem>
            <Button
              size="sm"
              onClick={clearFilters}
              bg="var(--secondary)"
              color="var(--foreground)"
              border="1px solid var(--border)"
              _hover={{ bg: 'var(--accent)' }}
              _active={{ bg: 'var(--secondary)' }}
              _focusVisible={{ boxShadow: '0 0 0 2px var(--ring)' }}
            >
              <X size={14} style={{ marginRight: '4px' }} />
              Limpar
            </Button>
          </WrapItem>
        </Wrap>
      )}
    </Container>
  )
}
