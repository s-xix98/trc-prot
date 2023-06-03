import type { Meta, StoryObj } from '@storybook/react';

import { Game } from './Game';

const meta = {
  component: Game,
  tags: ['autodocs'],
} satisfies Meta<typeof Game>;

export default meta;

type Story = StoryObj<typeof Game>;

export const BasicSkipSnapshotTest: Story = {};
