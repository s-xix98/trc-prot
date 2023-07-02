import type { Meta, StoryObj } from '@storybook/react';

import { SignUpForm } from './SignUpForm';

const meta = {
  component: SignUpForm,
  tags: ['autodocs'],
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Basic: Story = {};
