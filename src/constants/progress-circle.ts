/**
 * Constantes para o componente de círculo de progresso
 */
export const PROGRESS_CIRCLE = {
  radius: 60,
  size: 140,
  strokeWidth: 8,
  center: 70, // metade do size
} as const;

/**
 * Calcula as propriedades do círculo de progresso
 * @param percentage - Porcentagem de progresso (0-100)
 * @returns Propriedades calculadas para o SVG
 */
export const calculateCircleProgress = (percentage: number) => {
  const { radius } = PROGRESS_CIRCLE;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return {
    circumference,
    strokeDasharray,
    strokeDashoffset,
  };
};