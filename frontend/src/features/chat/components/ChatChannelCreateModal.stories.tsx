import type { Meta, StoryObj } from '@storybook/react';

import { ChatChannelCreateModal } from './ChatChannelCreateModal';

const meta = {
  component: ChatChannelCreateModal,
  tags: ['autodocs'],
} satisfies Meta<typeof ChatChannelCreateModal>;

export default meta;

type Story = StoryObj<typeof ChatChannelCreateModal>;

export const Basic: Story = {};
