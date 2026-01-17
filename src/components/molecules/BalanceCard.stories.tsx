import type { Meta, StoryObj } from '@storybook/react-vite';
import { BalanceCard } from './BalanceCard';

const meta = {
  title: 'Molecules/BalanceCard',
  component: BalanceCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['available', 'locked', 'reserve', 'total'],
    },
    label: { control: 'text' },
    amount: { control: 'number' },
  },
} satisfies Meta<typeof BalanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Saldo Total',
    amount: 12500.50,
    variant: 'total',
  },
};

export const Variants: Story = {
  args: {
    label: '',
    amount: 0,
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <BalanceCard label="Disponível" amount={5000} variant="available" />
      <BalanceCard label="Bloqueado" amount={2500} variant="locked" />
      <BalanceCard label="Reserva" amount={1000} variant="reserve" />
      <BalanceCard label="Total" amount={8500} variant="total" />
    </div>
  ),
};
