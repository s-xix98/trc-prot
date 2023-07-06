import type { Meta, StoryObj } from '@storybook/react';

import Fa from './page';

const meta = {
  component: Fa,
  tags: ['autodocs'],
} satisfies Meta<typeof Fa>;

export default meta;

type Story = StoryObj<typeof Fa>;

export const Basic: Story = {};
