import type { Meta, StoryObj } from '@storybook/react';

import { Ranking } from './Ranking';

const meta = {
  component: Ranking,
  tags: ['autodocs'],
} satisfies Meta<typeof Ranking>;

export default meta;

type Story = StoryObj<typeof Ranking>;

export const Basic: Story = {};
