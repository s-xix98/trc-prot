import type { Meta, StoryObj } from '@storybook/react';

import { Counter } from './Counter';

const meta = {
  component: Counter,
  tags: ['autodocs'],
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof Counter>;

export const Basic: Story = {};
