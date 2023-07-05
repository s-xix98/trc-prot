import type { Meta, StoryObj } from '@storybook/react';

import { ChannelInfo } from './ChannelInfo';

const meta = {
  component: ChannelInfo,
  tags: ['autodocs'],
} satisfies Meta<typeof ChannelInfo>;

export default meta;

type Story = StoryObj<typeof ChannelInfo>;

export const Basic: Story = {
  args: {
    selectedChannel: {
      id: 'id',
      roomName: 'roomName',
    },
  },
};
