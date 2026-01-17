import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from './StatusBadge';

const meta = {
  title: 'Molecules/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'executed', 'cancelled', 'locked'],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'pending',
  },
};

export const Variants: Story = {
  args: {
    status: 'pending',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <StatusBadge status="pending" />
      <StatusBadge status="executed" />
      <StatusBadge status="locked" />
      <StatusBadge status="cancelled" />
    </div>
  ),
};
