import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseForm } from './BaseForm';
import {
  Input,
  Field,
  Textarea,
  VStack,
  Text,
  NativeSelect,
} from '@chakra-ui/react';
import {
  DollarSign,
  CreditCard,
  User,
  Target
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof BaseForm> = {
  title: 'UI/BaseForm',
  component: BaseForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente base para padronização de formulários no BFIN. Oferece layouts consistentes, estados de loading/erro e diferentes variantes visuais.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['green-header', 'white-container', 'fullscreen'],
      description: 'Variante visual do formulário'
    },
    backButtonVariant: {
      control: 'select',
      options: ['arrow', 'x'],
      description: 'Tipo de botão de voltar (arrow para header verde, x para branco)'
    }
  }
};

export default meta;
type Story = StoryObj<typeof BaseForm>;

// Green Header Variant - Comum em formulários financeiros
export const GreenHeaderFinancial: Story = {
  args: {
    title: 'Nova Despesa',
    subtitle: 'Registre um novo gasto',
    icon: DollarSign,
    variant: 'green-header',
    displayValue: {
      value: 'R$ 150,00',
      label: 'Valor da despesa',
      editable: true,
      onEdit: () => alert('Editando valor...')
    },
    primaryAction: {
      label: 'Salvar Despesa',
      onClick: () => alert('Salvando despesa...'),
    },
    actions: [
      {
        label: 'Cancelar',
        onClick: () => alert('Cancelando...'),
        variant: 'outline'
      }
    ],
    onBack: () => alert('Voltando...')
  },
  render: (args) => (
    <BaseForm {...args}>
      <VStack gap={4} align="stretch" px={{ base: 4, md: 6 }}>
        <Field.Root>
          <Field.Label color="var(--card-foreground)">Descrição</Field.Label>
          <Input placeholder="Ex: Supermercado, Combustível..." />
        </Field.Root>

        <Field.Root>
          <Field.Label color="var(--card-foreground)">Categoria</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field placeholder="Selecione uma categoria">
              <option value="alimentacao">Alimentação</option>
              <option value="transporte">Transporte</option>
              <option value="saude">Saúde</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label color="var(--card-foreground)">Data de Vencimento</Field.Label>
          <Input type="date" />
        </Field.Root>
      </VStack>
    </BaseForm>
  )
};

// White Container Variant - Para formulários simples
export const WhiteContainer: Story = {
  args: {
    title: 'Editar Perfil',
    icon: User,
    variant: 'white-container',
    backButtonVariant: 'x',
    primaryAction: {
      label: 'Salvar Alterações',
      onClick: () => alert('Salvando perfil...'),
    },
    actions: [
      {
        label: 'Cancelar',
        onClick: () => alert('Cancelando...'),
        variant: 'outline'
      }
    ],
    onCancel: () => alert('Fechando formulário...')
  },
  render: (args) => (
    <BaseForm {...args}>
      <VStack gap={4} align="stretch">
        <Field.Root>
          <Field.Label>Nome Completo</Field.Label>
          <Input defaultValue="João Silva" />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input type="email" defaultValue="joao@email.com" />
        </Field.Root>

        <Field.Root>
          <Field.Label>Telefone</Field.Label>
          <Input defaultValue="(11) 99999-9999" />
        </Field.Root>

        <Field.Root>
          <Field.Label>Bio</Field.Label>
          <Textarea placeholder="Conte um pouco sobre você..." />
        </Field.Root>
      </VStack>
    </BaseForm>
  )
};

// Loading State
export const LoadingState: Story = {
  args: {
    title: 'Carregando Dados',
    variant: 'green-header',
    isLoading: true,
  }
};

// Error State
export const ErrorState: Story = {
  args: {
    title: 'Erro ao Carregar',
    variant: 'green-header',
    error: 'Não foi possível carregar os dados da conta. Verifique sua conexão.',
    primaryAction: {
      label: 'Tentar Novamente',
      onClick: () => alert('Tentando novamente...'),
    },
    onBack: () => alert('Voltando...')
  }
};

// Display Value Interactive
export const InteractiveValue: Story = {
  render: () => {
    const [value, setValue] = useState(250.50);
    const [isEditing, setIsEditing] = useState(false);

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(val);
    };

    return (
      <BaseForm
        title="Limite Diário"
        subtitle="Ajuste seu limite de gastos"
        icon={Target}
        variant="green-header"
        displayValue={{
          value: isEditing ? `Editando...` : formatCurrency(value),
          label: 'Limite calculado automaticamente',
          editable: true,
          onEdit: () => {
            setIsEditing(true);
            setTimeout(() => {
              setValue(Math.random() * 500 + 100);
              setIsEditing(false);
            }, 1000);
          }
        }}
        primaryAction={{
          label: 'Confirmar Limite',
          onClick: () => alert(`Limite definido: ${formatCurrency(value)}`),
          loading: isEditing
        }}
        onBack={() => alert('Voltando...')}
      >
        <VStack gap={4} align="stretch" px={{ base: 4, md: 6 }}>
          <Text color="var(--card-foreground)" textAlign="center" py={8}>
            Clique no valor acima para ver o comportamento interativo!
          </Text>

          <Text color="var(--muted-foreground)" fontSize="sm" textAlign="center">
            O limite é calculado com base no seu saldo disponível e padrão de gastos.
          </Text>
        </VStack>
      </BaseForm>
    );
  }
};

// Custom Header Content
export const CustomHeaderContent: Story = {
  args: {
    title: 'Transferência',
    subtitle: 'Envie dinheiro para outro usuário',
    icon: CreditCard,
    variant: 'green-header',
    displayValue: {
      value: 'R$ 500,00',
      label: 'Valor a transferir'
    },
    headerContent: (
      <Text
        bg="rgba(255, 255, 255, 0.2)"
        px={3}
        py={1}
        borderRadius="full"
        fontSize="xs"
        color="var(--primary-foreground)"
        fontWeight="bold"
      >
        PIX
      </Text>
    ),
    primaryAction: {
      label: 'Confirmar Transferência',
      onClick: () => alert('Transferindo...'),
    },
    onBack: () => alert('Voltando...')
  },
  render: (args) => (
    <BaseForm {...args}>
      <VStack gap={4} align="stretch" px={{ base: 4, md: 6 }}>
        <Field.Root>
          <Field.Label color="var(--card-foreground)">Chave PIX do destinatário</Field.Label>
          <Input placeholder="email@exemplo.com, CPF ou telefone" />
        </Field.Root>

        <Field.Root>
          <Field.Label color="var(--card-foreground)">Mensagem (opcional)</Field.Label>
          <Textarea placeholder="Adicione uma mensagem..." />
        </Field.Root>
      </VStack>
    </BaseForm>
  )
};

// Footer Content Example
export const FooterContent: Story = {
  args: {
    title: 'Configurações',
    variant: 'white-container',
    primaryAction: {
      label: 'Salvar',
      onClick: () => alert('Salvando configurações...'),
    },
    footerContent: (
      <Text fontSize="xs" color="var(--muted-foreground)">
        Última sincronização: há 5 minutos
      </Text>
    ),
    onCancel: () => alert('Cancelando...')
  },
  render: (args) => (
    <BaseForm {...args}>
      <VStack gap={4} align="stretch">
        <Field.Root>
          <Field.Label>Notificações push</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field defaultValue="enabled">
              <option value="enabled">Habilitadas</option>
              <option value="disabled">Desabilitadas</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label>Modo escuro</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field defaultValue="auto">
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="auto">Automático</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Field.Root>
      </VStack>
    </BaseForm>
  )
};