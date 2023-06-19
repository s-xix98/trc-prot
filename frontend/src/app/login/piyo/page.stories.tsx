import type { Meta, StoryObj } from '@storybook/react';

import Piyo from './page';

const meta = {
  component: Piyo,
  tags: ['autodocs'],
} satisfies Meta<typeof Piyo>;

export default meta;

type Story = StoryObj<typeof Piyo>;

export const Basic: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
