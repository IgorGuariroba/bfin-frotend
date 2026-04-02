/**
 * Definições de tipos e constantes para formulários expandidos
 * Centraliza todos os tipos de formulários disponíveis no Dashboard
 */

export const EXPANDED_FORMS = {
  EXTRATO: 'extrato',
  TRANSACOES: 'transacoes',
  PAGAR: 'pagar',
  DEPOSITAR: 'depositar',
  EMPRESTIMOS: 'emprestimos',
  AJUSTAR_LIMITE: 'ajustar-limite',
  TRANSFERIR: 'transferir',
  BFIN_PARCEIRO: 'bfin-parceiro',
  CALENDARIO: 'calendario',
  HIST_FINAN: 'hist-finan',
} as const;

export type ExpandedFormType = typeof EXPANDED_FORMS[keyof typeof EXPANDED_FORMS] | null;

/**
 * Interface para configuração de formulários no registry
 */
export interface FormConfig {
  component: React.ComponentType<{ onCancel: () => void; onSuccess?: () => void }>;
  props?: Record<string, unknown>;
  customWrapper?: React.ComponentType<{ children: React.ReactNode; onCancel: () => void }>;
}