import type { Meta, StoryObj } from '@storybook/react';

import { Terminal } from './Terminal';

const meta = {
  component: Terminal,
  tags: ['autodocs'],
} satisfies Meta<typeof Terminal>;

export default meta;

type Story = StoryObj<typeof Terminal>;

export const Basic: Story = {};
