import type { Meta, StoryObj } from '@storybook/react';

import { TerminalOutput } from './TerminalOutput';

const meta = {
  component: TerminalOutput,
  tags: ['autodocs'],
} satisfies Meta<typeof TerminalOutput>;

export default meta;

type Story = StoryObj<typeof TerminalOutput>;

export const Basic: Story = {
  args: {
    outputArr: [],
  },
};
