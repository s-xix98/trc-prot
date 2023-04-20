import type { Meta, StoryObj } from '@storybook/react';

import { SendButton } from './SendButton';

const meta = {
  component: SendButton,
  tags: ['autodocs'],
} satisfies Meta<typeof SendButton>;

export default meta;

type Story = StoryObj<typeof SendButton>;

export const Basic: Story = {};

export const Act: Story = {
  args: {
    sendBtnAct: () => {
      alert('this is sendBtnAct');
    },
  },
};
