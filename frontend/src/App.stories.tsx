import type { Meta, StoryObj } from '@storybook/react';

import App from './App';

const meta = {
  component: App,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof App>;

export const Basic: Story = {};
