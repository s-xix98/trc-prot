import type { Meta, StoryObj } from '@storybook/react';

import { SearchUser } from './Search';

const meta = {
  component: SearchUser,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchUser>;

export default meta;

type Story = StoryObj<typeof SearchUser>;

export const Basic: Story = {};
