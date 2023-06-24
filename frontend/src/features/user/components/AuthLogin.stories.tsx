import type { Meta, StoryObj } from '@storybook/react';

import { AuthLogin } from './AuthLogin';

const meta = {
  component: AuthLogin,
  tags: ['autodocs'],
} satisfies Meta<typeof AuthLogin>;

export default meta;

type Story = StoryObj<typeof AuthLogin>;

export const Basic: Story = {};
