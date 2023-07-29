import type { Meta, StoryObj } from '@storybook/react';

import { ShowChatRoomMembers } from './ChatRoomMembers';

const meta = {
  component: ShowChatRoomMembers,
  tags: ['autodocs'],
} satisfies Meta<typeof ShowChatRoomMembers>;

export default meta;

type Story = StoryObj<typeof ShowChatRoomMembers>;

export const Basic: Story = {
  args: {
    roomMembers: []
  }
};
