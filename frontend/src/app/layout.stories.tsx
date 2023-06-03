import type { Meta, StoryObj } from '@storybook/react';

import RootLayout from './layout';

const meta = {
  component: RootLayout,
  tags: ['autodocs'],
} satisfies Meta<typeof RootLayout>;

export default meta;

type Story = StoryObj<typeof RootLayout>;

export const Basic: Story = {};
