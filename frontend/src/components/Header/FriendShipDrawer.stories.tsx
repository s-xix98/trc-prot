import type { Meta, StoryObj } from '@storybook/react';

import { FriendshipDrawer } from './FriendShipDrawer';

const meta = {
  component: FriendshipDrawer,
  tags: ['autodocs'],
} satisfies Meta<typeof FriendshipDrawer>;

export default meta;

type Story = StoryObj<typeof FriendshipDrawer>;

export const Basic: Story = {};