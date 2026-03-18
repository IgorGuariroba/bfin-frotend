/**
 * Utilitários de formatação para a aplicação BFIN
 * Centraliza todas as funções de formatação para evitar duplicação
 */

/**
 * Formata um valor numérico para moeda brasileira (Real)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como moeda brasileira (ex: "R$ 1.234,56")
 *
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(0) // "R$ 0,00"
 * formatCurrency(-500) // "-R$ 500,00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um valor numérico para porcentagem brasileira
 * @param value - Valor decimal (ex: 0.15 para 15%)
 * @param minimumFractionDigits - Mínimo de casas decimais (padrão: 2)
 * @param maximumFractionDigits - Máximo de casas decimais (padrão: 2)
 * @returns String formatada como porcentagem (ex: "15,00%")
 *
 * @example
 * formatPercentage(0.15) // "15,00%"
 * formatPercentage(0.1234) // "12,34%"
 */
export function formatPercentage(
  value: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formata um número para o padrão brasileiro
 * @param value - Valor numérico
 * @param minimumFractionDigits - Mínimo de casas decimais (padrão: 0)
 * @param maximumFractionDigits - Máximo de casas decimais (padrão: 2)
 * @returns String formatada no padrão brasileiro (ex: "1.234,56")
 *
 * @example
 * formatNumber(1234.56) // "1.234,56"
 * formatNumber(1000, 0, 0) // "1.000"
 */
export function formatNumber(
  value: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formata um valor monetário de forma compacta (K, M, B)
 * @param value - Valor numérico
 * @returns String formatada de forma compacta (ex: "R$ 1,2K", "R$ 1,5M")
 *
 * @example
 * formatCompactCurrency(1200) // "R$ 1,2K"
 * formatCompactCurrency(1500000) // "R$ 1,5M"
 */
export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

/**
 * Formata uma data para o padrão brasileiro com hora
 * @param date - String de data ISO ou objeto Date
 * @returns String formatada no padrão brasileiro (ex: "17/03/2026 14:30")
 *
 * @example
 * formatDate('2026-03-17T14:30:00Z') // "17/03/2026 14:30"
 * formatDate(new Date()) // "17/03/2026 14:30"
 */
export function formatDate(date: string | Date): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObject);
}