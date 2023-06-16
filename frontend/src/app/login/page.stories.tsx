import type { Meta, StoryObj } from '@storybook/react';

import Login from './page';

const meta = {
  component: Login,
  tags: ['autodocs'],
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof Login>;

export const Basic: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
