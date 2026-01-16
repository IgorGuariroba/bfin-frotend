import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormSelect } from './FormSelect';

const meta = {
  title: 'Molecules/FormSelect',
  component: FormSelect,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isRequired: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Selecione uma opção',
    children: (
      <>
        <option value="">Selecione...</option>
        <option value="1">Opção 1</option>
        <option value="2">Opção 2</option>
        <option value="3">Opção 3</option>
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    label: 'Conta',
    isRequired: true,
    children: (
      <>
        <option value="">Selecione uma conta</option>
        <option value="1">Conta Corrente - R$ 1.500,00</option>
        <option value="2">Poupança - R$ 3.200,00</option>
        <option value="3">Investimentos - R$ 5.000,00</option>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    label: 'Categoria',
    error: 'Este campo é obrigatório',
    children: (
      <>
        <option value="">Selecione uma categoria</option>
        <option value="1">Salário</option>
        <option value="2">Freelance</option>
        <option value="3">Investimentos</option>
      </>
    ),
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Tipo de Conta',
    helperText: 'Selecione o tipo de conta bancária',
    children: (
      <>
        <option value="">Selecione...</option>
        <option value="checking">Conta Corrente</option>
        <option value="savings">Poupança</option>
        <option value="investment">Investimentos</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo Desabilitado',
    disabled: true,
    children: (
      <>
        <option value="">Não é possível selecionar</option>
        <option value="1">Opção 1</option>
        <option value="2">Opção 2</option>
      </>
    ),
  },
};
