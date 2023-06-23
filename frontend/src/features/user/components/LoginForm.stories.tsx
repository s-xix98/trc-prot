import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { LoginForm } from './LoginForm';

const meta = {
  component: LoginForm,
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof LoginForm>;

export const Basic: Story = {};

export const InvalidForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInputElem = canvas.getByPlaceholderText('email');
    const passwordInputElem = canvas.getByPlaceholderText('password');
    const submitBtn = canvas.getByRole('button', { name: 'Submit' });

    if (!emailInputElem || !passwordInputElem || !submitBtn) {
      expect(false);
      return;
    }

    await userEvent.type(emailInputElem, 'email addr');
    await userEvent.type(passwordInputElem, 'password');

    await userEvent.click(submitBtn);
  },
};
