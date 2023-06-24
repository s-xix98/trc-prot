import type { Meta, StoryObj } from '@storybook/react';

import { ChannelEntryModal } from './ChannelEntryModal';

const meta = {
  component: ChannelEntryModal,
  tags: ['autodocs'],
} satisfies Meta<typeof ChannelEntryModal>;

export default meta;

type Story = StoryObj<typeof ChannelEntryModal>;

export const Basic: Story = {};
