import type { Meta, StoryObj } from '@storybook/react';

import { Blocks } from './Blocks';

const meta = {
  component: Blocks,
  tags: ['autodocs'],
} satisfies Meta<typeof Blocks>;

export default meta;

type Story = StoryObj<typeof Blocks>;

export const Basic: Story = {};
