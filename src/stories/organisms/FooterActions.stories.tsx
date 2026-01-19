import type { Meta, StoryObj } from '@storybook/react-vite';
import { FooterActions } from '../../components/organisms/FooterActions';
import { Provider } from '../../components/ui/provider';
import { Box } from '@chakra-ui/react';
import { useState } from 'react';

const meta: Meta<typeof FooterActions> = {
  title: 'Organisms/FooterActions',
  component: FooterActions,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider>
        <Box bg="gray.50" minH="100vh" p={4} _dark={{ bg: "gray.900" }}>
          <Box mb="120px">
            <p>Content area - scroll down to see footer</p>
            <Box h="80vh" bg="white" borderRadius="md" p={4} _dark={{ bg: "gray.800" }}>
              <p>Simulated page content...</p>
            </Box>
          </Box>
          <Story />
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
type Story = StoryObj<typeof FooterActions>;

// Component wrapper para controlar estado
function FooterActionsWrapper() {
  type ExpandedFormType = 'pagar' | 'bfin-parceiro' | 'transferir' | 'depositar' | 'emprestimos' | 'agendar-pagamento' | 'recarga-celular' | 'ajustar-limite' | 'extrato' | 'calendario' | null;
  const [expandedForm, setExpandedForm] = useState<ExpandedFormType>(null);

  return (
    <FooterActions
      expandedForm={expandedForm}
      onFormSelect={setExpandedForm}
    />
  );
}

export const Desktop: Story = {
  render: () => <FooterActionsWrapper />,
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const Tablet: Story = {
  render: () => <FooterActionsWrapper />,
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const Mobile: Story = {
  render: () => <FooterActionsWrapper />,
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};

export const MobileScrollDemo: Story = {
  render: () => <FooterActionsWrapper />,
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: 'No mobile, o footer permite scroll horizontal para acessar todas as ações. Teste deslizando horizontalmente.',
      },
    },
  },
};