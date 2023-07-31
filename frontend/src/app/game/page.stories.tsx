import type { Meta, StoryObj } from '@storybook/react';

import GamePage from './page';

const meta = {
  component: GamePage,
  tags: ['autodocs'],
} satisfies Meta<typeof GamePage>;

export default meta;

type Story = StoryObj<typeof GamePage>;

export const Basic: Story = {};
