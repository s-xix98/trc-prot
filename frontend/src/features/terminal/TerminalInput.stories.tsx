import type { Meta, StoryObj } from '@storybook/react';

import { TerminalInput } from './TerminalInput';

const meta = {
  component: TerminalInput,
  tags: ['autodocs'],
} satisfies Meta<typeof TerminalInput>;

export default meta;

type Story = StoryObj<typeof TerminalInput>;

export const Basic: Story = {};
