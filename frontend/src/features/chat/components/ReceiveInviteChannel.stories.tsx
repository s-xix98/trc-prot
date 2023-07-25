import type { Meta, StoryObj } from '@storybook/react';

import { ReceiveInviteChannel } from './ReceiveInviteChannel';

const meta = {
  component: ReceiveInviteChannel,
  tags: ['autodocs'],
} satisfies Meta<typeof ReceiveInviteChannel>;

export default meta;

type Story = StoryObj<typeof ReceiveInviteChannel>;

export const Basic: Story = {};
