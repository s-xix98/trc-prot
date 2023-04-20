import type { Meta, StoryObj } from '@storybook/react';

import { ChatHistory } from './ChatHistory';

const meta = {
  component: ChatHistory,
  tags: ['autodocs'],
} satisfies Meta<typeof ChatHistory>;

export default meta;

type Story = StoryObj<typeof ChatHistory>;

const items: string[] = [];
for (let n = 0; n < 100; n++) {
  items.push(`hoge ${n}`);
}

export const Basic: Story = {
  args: {
    chatHistMsgs: items,
  },
};
