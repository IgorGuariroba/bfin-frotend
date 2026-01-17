import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';

const meta = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    type: 'email',
  },
};

export const Required: Story = {
  args: {
    label: 'Nome',
    placeholder: 'Digite seu nome',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    type: 'email',
    error: 'Este campo é obrigatório',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Senha',
    placeholder: 'Digite sua senha',
    type: 'password',
    helperText: 'Mínimo de 8 caracteres',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo Desabilitado',
    placeholder: 'Não é possível editar',
    disabled: true,
  },
};

export const Types: Story = {
  args: {
    label: 'Types Example',
    type: 'text',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <FormField label="Texto" type="text" placeholder="Digite um texto" />
      <FormField label="Email" type="email" placeholder="seu@email.com" />
      <FormField label="Senha" type="password" placeholder="Digite sua senha" />
      <FormField label="Número" type="number" placeholder="0" />
      <FormField label="Telefone" type="tel" placeholder="(00) 00000-0000" />
      <FormField label="URL" type="url" placeholder="https://exemplo.com" />
    </div>
  ),
};
