import type { Meta, StoryObj } from '@storybook/react';

import { ChannelSearchModal } from './ChannelSearchModal';

const meta = {
  component: ChannelSearchModal,
  tags: ['autodocs'],
} satisfies Meta<typeof ChannelSearchModal>;

export default meta;

type Story = StoryObj<typeof ChannelSearchModal>;

export const Basic: Story = {};
