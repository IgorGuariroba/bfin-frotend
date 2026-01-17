import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoBox } from './InfoBox';

const meta = {
  title: 'Molecules/InfoBox',
  component: InfoBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'warning', 'error', 'success'],
    },
    title: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof InfoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is an information message.',
    variant: 'info',
  },
};

export const Variants: Story = {
  args: {
    children: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <InfoBox variant="info" title="Information">
        System update scheduled for tonight.
      </InfoBox>
      <InfoBox variant="warning" title="Warning">
        Your account is nearing its limit.
      </InfoBox>
      <InfoBox variant="error" title="Error">
        Failed to save changes.
      </InfoBox>
      <InfoBox variant="success" title="Success">
        Transaction completed successfully.
      </InfoBox>
    </div>
  ),
};

export const WithTitle: Story = {
  args: {
    title: 'Important Note',
    children: 'Please review the details before submitting.',
    variant: 'warning',
  },
};
