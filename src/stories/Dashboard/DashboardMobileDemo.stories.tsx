import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard } from '../../pages/Dashboard';
import { Provider } from '../../components/ui/provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/AuthContext';

const meta: Meta<typeof Dashboard> = {
  title: 'Pages/Dashboard Mobile Demo',
  component: Dashboard,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: Infinity,
          },
        },
      });

      return (
        <Provider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Story />
            </AuthProvider>
          </QueryClientProvider>
        </Provider>
      );
    },
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
type Story = StoryObj<typeof Dashboard>;

export const MobileHiddenSidebar: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: `
🚀 **NOVA FUNCIONALIDADE: SIDEBAR HIDDEN NO MOBILE**

**O que mudou:**
- Sidebar completamente oculta no mobile por padrão
- Botão hambúrguer (☰) no header para abrir a sidebar
- Botão Home (🏠) sempre disponível no header quando sidebar está oculta
- Sidebar desliza da lateral esquerda com animação suave
- Backdrop overlay para fechar clicando fora
- Maximiza espaço da tela para conteúdo principal

**Como testar:**
1. Visualize no viewport mobile (375px)
2. Note que a sidebar está completamente oculta
3. Clique no botão hambúrguer (☰) no header - sidebar desliza da lateral
4. Clique em qualquer item do menu - sidebar fecha automaticamente
5. Clique fora da sidebar (backdrop) - sidebar fecha
6. Use o botão Home (🏠) no header para navegação rápida

**Benefícios:**
- ✅ Mais espaço para conteúdo principal no mobile
- ✅ UX mobile nativa com slide da lateral
- ✅ Controles sempre acessíveis no header
- ✅ Animações suaves e profissionais
- ✅ Auto-fechamento inteligente após ações
        `,
      },
    },
  },
};

export const TabletTransition: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    docs: {
      description: {
        story: `
📱 **TRANSIÇÃO TABLET**

No viewport de tablet (768px), a sidebar ainda usa o modo collapsed tradicional.
A mudança para "hidden" só acontece em telas menores que 768px.

**Como testar:**
- Redimensione a tela de desktop para mobile
- Note como a sidebar transiciona automaticamente de collapsed → hidden
        `,
      },
    },
  },
};

export const DesktopNormalBehavior: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: `
💻 **DESKTOP - COMPORTAMENTO PRESERVADO**

No desktop, o comportamento da sidebar permanece inalterado:
- Sidebar collapsed por padrão
- Toggle normal entre collapsed ↔ expanded
- Sem controles móveis no header
- Layout tradicional mantido

**Como testar:**
- Note que não há botões móveis no header
- Sidebar funciona como antes no desktop
- Toggle normal com o botão ⚙️ na sidebar
        `,
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: `
🔄 **DEMO RESPONSIVO COMPLETO**

**Instruções para teste completo:**

1. **Desktop (1200px):**
   - Sidebar collapsed visível
   - Sem controles móveis no header
   - Toggle tradicional funciona

2. **Tablet (768px):**
   - Sidebar ainda visível (collapsed)
   - Comportamento intermediário

3. **Mobile (375px):**
   - Sidebar completamente oculta
   - Controles móveis aparecem no header
   - Botão hambúrguer ativa slide da lateral

4. **Teste de resize:**
   - Redimensione a janela do browser
   - Note a transição automática entre modos
   - Sidebar fecha automaticamente ao mudar para mobile

**Tecnologias utilizadas:**
- ✅ Chakra UI v3 useBreakpointValue
- ✅ CSS animations com @keyframes
- ✅ React useState + useCallback otimizado
- ✅ TypeScript com tipos customizados
- ✅ Responsive design mobile-first
        `,
      },
    },
  },
};