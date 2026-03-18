import { Box, Center, Text } from '@chakra-ui/react';
import { PROGRESS_CIRCLE, calculateCircleProgress } from '../../constants/progress-circle';

interface CircularProgressProps {
  percentage: number;
  color: string;
  label?: string;
}

/**
 * Componente de progresso circular com porcentagem central
 */
export function CircularProgress({ percentage, color, label = 'Usado' }: CircularProgressProps) {
  const { strokeDasharray, strokeDashoffset } = calculateCircleProgress(percentage);
  const { radius, size, strokeWidth, center } = PROGRESS_CIRCLE;

  return (
    <Center>
      <Box position="relative" width={`${size}px`} height={`${size}px`}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Círculo de fundo */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Círculo de progresso */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.6s ease-in-out',
            }}
          />
        </svg>

        {/* Texto central */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="var(--card-foreground)"
            lineHeight="1"
          >
            {percentage.toFixed(1)}%
          </Text>
          <Text
            fontSize="xs"
            color="var(--muted-foreground)"
            mt={1}
          >
            {label}
          </Text>
        </Box>
      </Box>
    </Center>
  );
}