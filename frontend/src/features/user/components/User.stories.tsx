import type { Meta, StoryObj } from '@storybook/react';

import { User } from './User';

const meta = {
  component: User,
  tags: ['autodocs'],
} satisfies Meta<typeof User>;

export default meta;

type Story = StoryObj<typeof User>;

export const Basic: Story = {};
