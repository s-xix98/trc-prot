import type { Meta, StoryObj } from '@storybook/react';

import { ChannelInvite } from './ChatInvite';

const meta = {
  component: ChannelInvite,
  tags: ['autodocs'],
} satisfies Meta<typeof ChannelInvite>;

export default meta;

type Story = StoryObj<typeof ChannelInvite>;

export const Basic: Story = {};
