import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { SignUpForm } from './SignUpForm';

const meta = {
  component: SignUpForm,
  tags: ['autodocs'],
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Basic: Story = {};

export const InvalidForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const usernameInputelem = canvas.getByPlaceholderText('username');
    const emailInputElem = canvas.getByPlaceholderText('email');
    const passwordInputElem = canvas.getByPlaceholderText('password');
    const submitBtn = canvas.getByRole('button', { name: 'Submit' });

    if (!emailInputElem || !passwordInputElem || !submitBtn) {
      expect(false);
      return;
    }

    await userEvent.type(usernameInputelem, 'test user');
    await userEvent.type(emailInputElem, 'email addr');
    await userEvent.type(passwordInputElem, 'password');

    await userEvent.click(submitBtn);
  },
};
