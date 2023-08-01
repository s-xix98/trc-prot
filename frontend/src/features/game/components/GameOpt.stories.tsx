import type { Meta, StoryObj } from '@storybook/react';

import { GameOptSetter } from './GameOpt';

const meta = {
  component: GameOptSetter,
  tags: ['autodocs'],
} satisfies Meta<typeof GameOptSetter>;

export default meta;

type Story = StoryObj<typeof GameOptSetter>;

export const Basic: Story = {};
