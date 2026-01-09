import { Badge } from '@chakra-ui/react';

interface StatusBadgeProps {
  status: 'pending' | 'executed' | 'cancelled' | 'locked';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    executed: {
      label: 'Executado',
      colorPalette: 'green',
    },
    locked: {
      label: 'Bloqueado',
      colorPalette: 'blue',
    },
    pending: {
      label: 'Pendente',
      colorPalette: 'yellow',
    },
    cancelled: {
      label: 'Cancelado',
      colorPalette: 'gray',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge colorPalette={config.colorPalette} fontSize="xs">
      {config.label}
    </Badge>
  );
}
