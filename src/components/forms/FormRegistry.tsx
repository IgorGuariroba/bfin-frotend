import React from 'react';
import { VStack, Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import type { FormConfig } from '../../types/ExpandedForms';
import { EXPANDED_FORMS } from '../../types/ExpandedForms';
import {
  ExtratoForm,
  AllTransactionsForm,
  ExpenseForm,
  IncomeForm,
  LoanForm,
  DailyLimitForm,
  TransferForm,
  BfinParceiroForm,
  CalendarForm,
} from '../organisms';

/**
 * Wrapper especial para o formulário de calendário com header verde
 */
// eslint-disable-next-line react-refresh/only-export-components
function CalendarWrapper({ children, onCancel }: { children: React.ReactNode; onCancel: () => void }) {
  return (
    <VStack gap={0} align="stretch" minH="100vh">
      <Box bg="var(--primary)" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} pb={{ base: 6, md: 8 }}>
        <Flex align="center" gap={4} mb={6}>
          <IconButton
            aria-label="Voltar"
            variant="ghost"
            onClick={onCancel}
            size="sm"
            color="var(--primary-foreground)"
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Heading size={{ base: 'md', md: 'lg' }} color="var(--primary-foreground)" flex="1">
            Calendário de Contas
          </Heading>
        </Flex>
        {children}
      </Box>
    </VStack>
  );
}

/**
 * Registry centralizado de todos os formulários expandidos
 * Para adicionar um novo formulário:
 * 1. Adicione a constant em EXPANDED_FORMS
 * 2. Adicione a entrada aqui no registry
 * 3. Configure props específicas se necessário
 */
export const FORM_REGISTRY: Record<string, FormConfig> = {
  [EXPANDED_FORMS.EXTRATO]: {
    component: ExtratoForm,
    props: {
      // onViewAll será injetado dinamicamente pelo renderer
    },
  },

  [EXPANDED_FORMS.TRANSACOES]: {
    component: AllTransactionsForm,
  },

  [EXPANDED_FORMS.PAGAR]: {
    component: ExpenseForm,
    props: {
      defaultType: 'variable',
    },
  },

  [EXPANDED_FORMS.DEPOSITAR]: {
    component: IncomeForm,
  },

  [EXPANDED_FORMS.EMPRESTIMOS]: {
    component: LoanForm,
  },

  [EXPANDED_FORMS.AJUSTAR_LIMITE]: {
    component: DailyLimitForm,
  },

  [EXPANDED_FORMS.TRANSFERIR]: {
    component: TransferForm,
  },

  [EXPANDED_FORMS.BFIN_PARCEIRO]: {
    component: BfinParceiroForm,
    props: {
      // invitationsCount e onOpenInvitations serão injetados dinamicamente
    },
  },

  [EXPANDED_FORMS.CALENDARIO]: {
    component: CalendarForm,
    customWrapper: CalendarWrapper,
  },
};

/**
 * Utilitário para verificar se um tipo de formulário existe no registry
 */
export function isValidFormType(formType: string): boolean {
  return formType in FORM_REGISTRY;
}

/**
 * Utilitário para obter a configuração de um formulário
 */
export function getFormConfig(formType: string): FormConfig | null {
  return FORM_REGISTRY[formType] || null;
}