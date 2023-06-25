import type { Meta, StoryObj } from '@storybook/react';

import { SearchUserOrChannel } from './Search';

const meta = {
  component: SearchUserOrChannel,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchUserOrChannel>;

export default meta;

type Story = StoryObj<typeof SearchUserOrChannel>;

export const Basic: Story = {};
