import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { SignUpForm } from './SignUpForm';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const meta = {
  component: SignUpForm,
  tags: ['autodocs'],
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Basic: Story = {};
