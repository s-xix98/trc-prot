import type { Meta, StoryObj } from '@storybook/react';

import { UserProfile } from './UserProfile';

const meta = {
  component: UserProfile,
  tags: ['autodocs'],
} satisfies Meta<typeof UserProfile>;

export default meta;

type Story = StoryObj<typeof UserProfile>;

export const Basic: Story = {};
