import type { Meta, StoryObj } from '@storybook/react';

import { BasicButton } from './BasicButton';

const meta = {
  component: BasicButton,
  tags: ['autodocs'],
} satisfies Meta<typeof BasicButton>;

export default meta;

type Story = StoryObj<typeof BasicButton>;

export const Basic: Story = {
  args: {
    children: 'this is button',
  },
};
