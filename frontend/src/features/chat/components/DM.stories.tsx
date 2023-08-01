import type { Meta, StoryObj } from '@storybook/react';

import { DM } from './DM';

const meta = {
  component: DM,
  tags: ['autodocs'],
} satisfies Meta<typeof DM>;

export default meta;

type Story = StoryObj<typeof DM>;

export const Basic: Story = {
  args: {
    targetUserInfo: {
      id: 'id',
      username: 'username',
    },
  },
};
