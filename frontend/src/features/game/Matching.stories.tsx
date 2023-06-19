import type { Meta, StoryObj } from '@storybook/react';

import { Matching } from './Matching';

const meta = {
  component: Matching,
  tags: ['autodocs'],
} satisfies Meta<typeof Matching>;

export default meta;

type Story = StoryObj<typeof Matching>;

export const Basic: Story = {};
