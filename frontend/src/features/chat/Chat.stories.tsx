import type { Meta, StoryObj } from '@storybook/react';

import { Chat } from './Chat';

const meta = {
  component: Chat,
  tags: ['autodocs'],
} satisfies Meta<typeof Chat>;

export default meta;

type Story = StoryObj<typeof Chat>;

export const Basic: Story = {};
