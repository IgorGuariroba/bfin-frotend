import React from 'react';
import { Box } from '@chakra-ui/react';
import type { ExpandedFormType } from '../../types/ExpandedForms';
import { EXPANDED_FORMS } from '../../types/ExpandedForms';
import { getFormConfig } from './FormRegistry';

/**
 * Container com animação para formulários expandidos
 */
function ExpandedContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="var(--primary)"
      zIndex={10}
      overflow="auto"
      data-testid="expanded-form"
      css={{
        animation: 'dropExpand 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        '@keyframes dropExpand': {
          '0%': {
            borderRadius: '50%',
            width: 'calc((100% - 112px) / 7)',
            height: '80px',
            bottom: '90px',
            left: '32px',
            top: 'auto',
            transform: 'scale(0.3)',
            opacity: 0.5,
          },
          '50%': {
            borderRadius: '24px',
            opacity: 0.8,
          },
          '100%': {
            borderRadius: '0',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            bottom: 0,
            transform: 'scale(1)',
            opacity: 1,
          },
        },
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Props para o ExpandedFormRenderer
 */
interface ExpandedFormRendererProps {
  expandedForm: ExpandedFormType;
  onClose: () => void;

  // Props específicas que podem ser injetadas dinamicamente
  extraProps?: {
    invitationsCount?: number;
    onOpenInvitations?: () => void;
  };
}

/**
 * Renderizador responsável por exibir formulários expandidos
 *
 * Responsabilidades:
 * - Renderizar o formulário correto baseado no tipo
 * - Aplicar animação de expansão
 * - Injetar props comuns (onCancel, onSuccess)
 * - Suportar wrappers customizados para casos especiais
 *
 * Benefícios Clean Code:
 * - Single Responsibility: apenas renderiza formulários
 * - Open/Closed: fácil adicionar novos formulários via registry
 * - Dependency Inversion: depende de abstrações (registry)
 */
export function ExpandedFormRenderer({
  expandedForm,
  onClose,
  extraProps = {}
}: ExpandedFormRendererProps) {
  // Early return se não há formulário para renderizar
  if (!expandedForm) {
    return null;
  }

  // Busca configuração no registry
  const config = getFormConfig(expandedForm);

  if (!config) {
    console.warn(`Configuração não encontrada para o formulário: ${expandedForm}`);
    return null;
  }

  const { component: FormComponent, props: configProps = {}, customWrapper: CustomWrapper } = config;

  // Props base que todos os formulários recebem
  const baseProps = {
    onCancel: onClose,
    onSuccess: onClose,
  };

  // Props específicas baseadas no tipo de formulário
  const specificProps = getSpecificProps(expandedForm, extraProps);

  // Merge de todas as props
  const finalProps = {
    ...baseProps,
    ...configProps,
    ...specificProps,
  };

  // Componente a ser renderizado
  const formElement = <FormComponent {...finalProps} />;

  // Se tem wrapper customizado, usa ele
  const content = CustomWrapper ? (
    <CustomWrapper onCancel={onClose}>
      <FormComponent {...finalProps} />
    </CustomWrapper>
  ) : (
    formElement
  );

  return <ExpandedContainer>{content}</ExpandedContainer>;
}

/**
 * Função para obter props específicas baseadas no tipo de formulário
 */
function getSpecificProps(
  formType: ExpandedFormType,
  context: { invitationsCount?: number; onOpenInvitations?: () => void }
) {
  const { invitationsCount, onOpenInvitations } = context;

  switch (formType) {
    case EXPANDED_FORMS.EXTRATO:
      return {
        onViewAll: () => {
          // Navegar para todas as transações
          // Esta lógica será movida para o hook posteriormente
          console.warn('Navigate to all transactions - TODO: implementar navegação');
        },
      };

    case EXPANDED_FORMS.BFIN_PARCEIRO:
      return {
        invitationsCount: invitationsCount || 0,
        onOpenInvitations: onOpenInvitations || (() => {}),
      };

    default:
      return {};
  }
}