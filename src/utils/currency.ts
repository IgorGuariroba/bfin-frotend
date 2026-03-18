export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCurrencyNumber = (value: string): number => {
  const numericValue = parseFloat(value) || 0;
  return numericValue;
};