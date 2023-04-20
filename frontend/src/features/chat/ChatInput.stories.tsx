import type { Meta, StoryObj } from '@storybook/react';

import { ChatInput } from './ChatInput';

const meta = {
  component: ChatInput,
  tags: ['autodocs'],
} satisfies Meta<typeof ChatInput>;

export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Basic: Story = {};
