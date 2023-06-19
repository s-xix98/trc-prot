import type { Meta, StoryObj } from '@storybook/react';

import Huga from './page';

const meta = {
  component: Huga,
  tags: ['autodocs'],
} satisfies Meta<typeof Huga>;

export default meta;

type Story = StoryObj<typeof Huga>;

export const Basic: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
