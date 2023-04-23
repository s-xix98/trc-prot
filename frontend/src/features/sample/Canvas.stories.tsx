import type { Meta, StoryObj } from '@storybook/react';

import { Canvas } from './Canvas';

const meta = {
  component: Canvas,
  tags: ['autodocs'],
} satisfies Meta<typeof Canvas>;

export default meta;

type Story = StoryObj<typeof Canvas>;

export const Basic: Story = {};
