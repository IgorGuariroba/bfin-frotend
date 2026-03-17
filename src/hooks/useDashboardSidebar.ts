import { useState, useRef } from 'react';
import {
  Shield,
  Wallet,
  Mail,
  CreditCard,
  DollarSign,
  Users,
  Calendar as CalendarIcon
} from 'lucide-react';
import type { MenuItem } from '../components/organisms/SidebarExpanded';
import type { SidebarState, ExpandedFormType } from '../components/organisms';

/**
 * Configurações padrão da sidebar
 * Extrai magic strings para constantes
 */
export const SIDEBAR_DEFAULTS = {
  MOBILE_STATE: 'hidden' as SidebarState,
  DESKTOP_STATE: 'collapsed' as SidebarState,
  HIDDEN_ON_MOBILE: true,
} as const;

/**
 * Interface para ações do menu da sidebar
 */
interface SidebarActions {
  onOpenForm: (form: ExpandedFormType) => void;
  onOpenManageAccounts: () => void;
}

/**
 * Hook para gerenciamento completo da sidebar
 * Responsabilidade única: estado e configuração da sidebar
 * Benefícios: lógica isolada, fácil modificação de menu items
 */
export function useDashboardSidebar(actions: SidebarActions) {
  const [sidebarState, setSidebarState] = useState<SidebarState>(SIDEBAR_DEFAULTS.MOBILE_STATE);
  const sidebarToggleRef = useRef<(() => void) | null>(null);

  /**
   * Configuração dos itens do menu da sidebar
   * Separado em função para facilitar manutenção
   */
  const createMenuItems = (): MenuItem[] => [
    {
      id: 'calendar',
      icon: CalendarIcon,
      label: 'Calendário',
      onClick: () => actions.onOpenForm('calendario'),
    },
    {
      id: 'help',
      icon: Shield,
      label: 'Me ajuda',
      onClick: () => {
        // TODO: Implement help functionality
      },
    },
    {
      id: 'profile',
      icon: Users,
      label: 'Perfil',
      onClick: () => {
        // TODO: Implement profile functionality
      },
    },
    {
      id: 'configure-account',
      icon: DollarSign,
      label: 'Configurar conta',
      onClick: actions.onOpenManageAccounts,
    },
    {
      id: 'configure-card',
      icon: CreditCard,
      label: 'Configurar cartão',
      onClick: () => {
        // TODO: Implement card configuration
      },
    },
    {
      id: 'business-account',
      icon: Wallet,
      label: 'Pedir conta PJ',
      onClick: () => {
        // TODO: Implement business account request
      },
    },
    {
      id: 'notifications',
      icon: Mail,
      label: 'Configurar notificações',
      onClick: () => {
        // TODO: Implement notifications configuration
      },
    },
  ];

  const menuItems = createMenuItems();

  // Handlers com nomes descritivos
  const handleSidebarStateChange = (newState: SidebarState) => {
    setSidebarState(newState);
  };

  const handleToggleSidebar = () => {
    if (sidebarToggleRef.current) {
      sidebarToggleRef.current();
    }
  };

  return {
    // Estado
    sidebarState,
    menuItems,
    sidebarToggleRef,

    // Actions
    handleSidebarStateChange,
    handleToggleSidebar,

    // Configurações
    config: {
      hiddenOnMobile: SIDEBAR_DEFAULTS.HIDDEN_ON_MOBILE,
      defaultMobileState: SIDEBAR_DEFAULTS.MOBILE_STATE,
      defaultDesktopState: SIDEBAR_DEFAULTS.DESKTOP_STATE,
    },
  };
}