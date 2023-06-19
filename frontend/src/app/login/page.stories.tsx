import type { Meta, StoryObj } from '@storybook/react';

import Login from './page';

const meta = {
  component: Login,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof Login>;

export const Basic: Story = {};
