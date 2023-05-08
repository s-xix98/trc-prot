import type { Meta, StoryObj } from '@storybook/react';

import Home from './page';

const meta = {
  component: Home,
  tags: ['autodocs'],
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof Home>;

export const Basic: Story = {};
