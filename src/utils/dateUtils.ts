/**
 * Utilitários para manipulação de datas com fuso horário brasileiro
 * Evita problemas de conversão UTC que causam diferença de 1 dia
 */

/**
 * Converte uma data para formato ISO mantendo o fuso horário local
 * Evita o problema do toISOString() que converte para UTC
 */
export function toLocalISOString(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  const localTime = new Date(date.getTime() - offset);
  return localTime.toISOString();
}

/**
 * Cria data de início do mês mantendo fuso horário local
 */
export function getMonthStart(date: Date): string {
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  return toLocalISOString(start);
}

/**
 * Cria data de fim do mês mantendo fuso horário local
 */
export function getMonthEnd(date: Date): string {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return toLocalISOString(end);
}

/**
 * Cria data de início do dia mantendo fuso horário local
 */
export function getDayStart(date: Date): string {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  return toLocalISOString(start);
}

/**
 * Cria data de fim do dia mantendo fuso horário local
 */
export function getDayEnd(date: Date): string {
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  return toLocalISOString(end);
}

/**
 * Converte string de data para Date considerando fuso horário local
 */
export function parseLocalDate(dateString: string): Date {
  // Se a string já contém informação de timezone, usa como está
  if (dateString.includes('T') && (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-'))) {
    return new Date(dateString);
  }

  // Se é apenas data (YYYY-MM-DD), trata como data local
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Outros formatos, converte normalmente
  return new Date(dateString);
}