import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { LoginForm } from './LoginForm';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const meta = {
  component: LoginForm,
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof LoginForm>;

export const Basic: Story = {};
