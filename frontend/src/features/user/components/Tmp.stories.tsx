import type { Meta, StoryObj } from '@storybook/react';

import { History } from './Tmp';

const meta = {
  component: History,
  tags: ['autodocs'],
} satisfies Meta<typeof History>;

export default meta;

type Story = StoryObj<typeof History>;

export const Basic: Story = {};
