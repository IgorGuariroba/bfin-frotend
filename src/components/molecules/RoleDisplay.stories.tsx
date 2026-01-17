import type { Meta, StoryObj } from '@storybook/react-vite';
import { RoleDisplay } from './RoleDisplay';

const meta = {
  title: 'Molecules/RoleDisplay',
  component: RoleDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: ['owner', 'member', 'viewer'],
    },
    showLabel: { control: 'boolean' },
  },
} satisfies Meta<typeof RoleDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    role: 'member',
    showLabel: true,
  },
};

export const Variants: Story = {
  args: {
    role: 'member',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <RoleDisplay role="owner" />
      <RoleDisplay role="member" />
      <RoleDisplay role="viewer" />
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    role: 'member',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <RoleDisplay role="owner" showLabel={false} />
      <RoleDisplay role="member" showLabel={false} />
      <RoleDisplay role="viewer" showLabel={false} />
    </div>
  ),
};
