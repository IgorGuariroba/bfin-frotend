import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from '../../components/organisms/Sidebar';
import type { MenuItem } from '../../components/organisms/SidebarExpanded';
import { Provider } from '../../components/ui/provider';
import { Box } from '@chakra-ui/react';
import {
  Shield,
  Users,
  DollarSign,
  CreditCard,
  Wallet,
  Mail,
  Settings,
  Bell,
} from 'lucide-react';

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider>
        <Box
          bg="gray.50"
          minH="100vh"
          display="flex"
          _dark={{ bg: "gray.900" }}
        >
          <Story />
          <Box flex="1" p={4} bg="white" _dark={{ bg: "gray.800" }}>
            <h2>Conteúdo Principal</h2>
            <p>Esta é a área principal do dashboard.</p>
            <p>A sidebar aparece à esquerda com funcionalidades responsivas.</p>
          </Box>
        </Box>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Menu items padrão
const defaultMenuItems: MenuItem[] = [
  {
    id: 'help',
    icon: Shield,
    label: 'Me ajuda',
    onClick: () => alert('Ajuda clicada!'),
  },
  {
    id: 'profile',
    icon: Users,
    label: 'Perfil',
    onClick: () => alert('Perfil clicado!'),
  },
  {
    id: 'configure-account',
    icon: DollarSign,
    label: 'Configurar conta',
    onClick: () => alert('Configurar conta clicada!'),
  },
  {
    id: 'configure-card',
    icon: CreditCard,
    label: 'Configurar cartão',
    onClick: () => alert('Configurar cartão clicado!'),
  },
  {
    id: 'business-account',
    icon: Wallet,
    label: 'Pedir conta PJ',
    onClick: () => alert('Conta PJ clicada!'),
  },
  {
    id: 'notifications',
    icon: Mail,
    label: 'Configurar notificações',
    onClick: () => alert('Notificações clicadas!'),
  },
];

// Menu items reduzido
const minimalMenuItems: MenuItem[] = [
  {
    id: 'profile',
    icon: Users,
    label: 'Perfil',
    onClick: () => alert('Perfil clicado!'),
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Configurações',
    onClick: () => alert('Configurações clicadas!'),
  },
];

export const DesktopCollapsed: Story = {
  args: {
    menuItems: defaultMenuItems,
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: false,
    defaultDesktopState: 'collapsed',
    showQRCode: true,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Sidebar no desktop iniciando colapsada. Clique no ⚙️ para expandir.',
      },
    },
  },
};

export const DesktopExpanded: Story = {
  args: {
    menuItems: defaultMenuItems,
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: false,
    defaultDesktopState: 'expanded',
    showQRCode: true,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Sidebar no desktop iniciando expandida. Clique no ⚙️ para colapsar.',
      },
    },
  },
};

export const MobileHidden: Story = {
  args: {
    menuItems: defaultMenuItems,
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: true,
    defaultMobileState: 'hidden',
    showQRCode: true,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: '🚀 NOVA FUNCIONALIDADE: Sidebar completamente oculta no mobile! Maximiza espaço da tela. Precisará de botão no header para abrir.',
      },
    },
  },
};

export const MobileSlideDemo: Story = {
  args: {
    menuItems: defaultMenuItems,
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: true,
    defaultMobileState: 'expanded',
    showQRCode: true,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: '✨ DEMO SLIDE: Sidebar deslizando da lateral no mobile com backdrop overlay. Clique fora para fechar.',
      },
    },
  },
};

export const MinimalMenu: Story = {
  args: {
    menuItems: minimalMenuItems,
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: false,
    defaultDesktopState: 'collapsed',
    showQRCode: true,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Sidebar com menu reduzido - apenas 2 itens.',
      },
    },
  },
};

export const WithoutQRCode: Story = {
  args: {
    menuItems: defaultMenuItems,
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: false,
    defaultDesktopState: 'expanded',
    showQRCode: false,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Sidebar sem seção de QR Code, útil para versões simplificadas.',
      },
    },
  },
};

export const CustomAccountInfo: Story = {
  args: {
    menuItems: defaultMenuItems,
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: false,
    defaultDesktopState: 'expanded',
    showQRCode: true,
    accountInfo: {
      agency: '1234',
      account: '9876543-2',
      bank: '123 - Banco Exemplo S.A.',
    },
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Sidebar com informações de conta customizadas.',
      },
    },
  },
};

export const DisabledMenuItem: Story = {
  args: {
    menuItems: [
      ...minimalMenuItems,
      {
        id: 'premium-feature',
        icon: Bell,
        label: 'Recurso Premium',
        onClick: () => alert('Recurso Premium clicado!'),
        disabled: true,
      },
    ],
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: false,
    defaultDesktopState: 'expanded',
    showQRCode: true,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Sidebar com item de menu desabilitado (Recurso Premium).',
      },
    },
  },
};

export const MobileHiddenWithControls: Story = {
  args: {
    menuItems: [
      {
        id: 'test-item',
        icon: Settings,
        label: 'Item de Teste',
        onClick: () => alert('Item de teste clicado! A sidebar deve fechar automaticamente no mobile.'),
      },
    ],
    onHomeClick: () => alert('Home clicado!'),
    onSignOut: () => alert('Desconectar clicado!'),
    onVisibilityClick: () => alert('Visibilidade clicada!'),
    hiddenOnMobile: true,
    defaultMobileState: 'hidden',
    showQRCode: false,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: '🎯 INTEGRAÇÃO COMPLETA: Simula como ficará no Dashboard real. Sidebar oculta + controles no header necessários para funcionar.',
      },
    },
  },
};