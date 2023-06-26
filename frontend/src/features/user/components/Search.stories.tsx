import type { Meta, StoryObj } from '@storybook/react';

import { UserSearch } from './Search';

const meta = {
  component: UserSearch,
  tags: ['autodocs'],
} satisfies Meta<typeof UserSearch>;

export default meta;

type Story = StoryObj<typeof UserSearch>;

export const Basic: Story = {};
