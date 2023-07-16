import type { Meta, StoryObj } from '@storybook/react';

import { FriendRequests } from './FriendRequests';

const meta = {
  component: FriendRequests,
  tags: ['autodocs'],
} satisfies Meta<typeof FriendRequests>;

export default meta;

type Story = StoryObj<typeof FriendRequests>;

export const Basic: Story = {};
