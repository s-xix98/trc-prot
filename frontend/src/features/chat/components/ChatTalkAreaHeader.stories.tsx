import type { Meta, StoryObj } from '@storybook/react';

import { ChatTalkAreaHeader } from './ChatTalkAreaHeader';

const meta = {
  component: ChatTalkAreaHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof ChatTalkAreaHeader>;

export default meta;

type Story = StoryObj<typeof ChatTalkAreaHeader>;

export const Basic: Story = {};
