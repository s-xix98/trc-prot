import type { Meta, StoryObj } from '@storybook/react';

import { handleMessageDto } from '../types/MessageDto';

import { ChatHistory } from './ChatHistory';

const meta = {
  component: ChatHistory,
  tags: ['autodocs'],
} satisfies Meta<typeof ChatHistory>;

export default meta;

type Story = StoryObj<typeof ChatHistory>;

const items: handleMessageDto[] = [];
for (let n = 0; n < 100; n++) {
  items.push({ nickname: 'hoge', msg: `hoge${n}` });
}

export const Basic: Story = {
  args: {
    chatHistMsgs: items,
  },
};
