import type { Meta, StoryObj } from '@storybook/react';

import { Tmp } from './Tmp';

const meta = {
  component: Tmp,
  tags: ['autodocs'],
} satisfies Meta<typeof Tmp>;

export default meta;

type Story = StoryObj<typeof Tmp>;

export const Basic: Story = {};
