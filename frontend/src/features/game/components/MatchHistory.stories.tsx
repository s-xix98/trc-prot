import type { Meta, StoryObj } from '@storybook/react';

import { MatchHistory } from './MatchHistory';

const meta = {
  component: MatchHistory,
  tags: ['autodocs'],
} satisfies Meta<typeof MatchHistory>;

export default meta;

type Story = StoryObj<typeof MatchHistory>;

export const Basic: Story = {
  args: {
    userInfo: {
      id: 'xxx',
      username: 'name',
    },
  },
};
