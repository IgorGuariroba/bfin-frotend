import { useState, useCallback } from 'react';
import type { ExpandedFormType } from '../types/ExpandedForms';
import { EXPANDED_FORMS } from '../types/ExpandedForms';
import { isValidFormType } from '../components/forms/FormRegistry';

/**
 * Hook customizado para gerenciar estado de formulários expandidos
 *
 * Benefícios:
 * - Centraliza a lógica de estado
 * - Fornece métodos type-safe para abrir/fechar formulários
 * - Validação automática de tipos de formulário
 * - Facilita testes unitários
 *
 * @param initialForm - Formulário inicial a ser expandido (opcional)
 */
export function useExpandedForm(initialForm?: ExpandedFormType) {
  const [expandedForm, setExpandedForm] = useState<ExpandedFormType>(initialForm ?? null);

  /**
   * Abre um formulário específico
   * Valida se o tipo existe no registry
   */
  const openForm = useCallback((formType: ExpandedFormType) => {
    if (formType && !isValidFormType(formType)) {
      console.warn(`Tipo de formulário inválido: ${formType}`);
      return;
    }
    setExpandedForm(formType);
  }, []);

  /**
   * Fecha o formulário atual
   */
  const closeForm = useCallback(() => {
    setExpandedForm(null);
  }, []);

  /**
   * Abre o formulário de extrato
   */
  const openExtrato = useCallback(() => {
    openForm(EXPANDED_FORMS.EXTRATO);
  }, [openForm]);

  /**
   * Abre todas as transações
   */
  const openAllTransactions = useCallback(() => {
    openForm(EXPANDED_FORMS.TRANSACOES);
  }, [openForm]);

  /**
   * Verifica se algum formulário está aberto
   */
  const hasOpenForm = expandedForm !== null;

  /**
   * Verifica se um formulário específico está aberto
   */
  const isFormOpen = useCallback((formType: ExpandedFormType) => {
    return expandedForm === formType;
  }, [expandedForm]);

  return {
    // Estado
    expandedForm,
    hasOpenForm,

    // Ações principais
    openForm,
    closeForm,

    // Ações específicas (para conveniência)
    openExtrato,
    openAllTransactions,

    // Utilitários
    isFormOpen,
  };
}