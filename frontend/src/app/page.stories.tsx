import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import Home from './page';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const meta = {
  component: Home,
  tags: ['autodocs'],
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof Home>;

export const Basic: Story = {};

export const Login: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginBtn = canvas.getByText('login as fuga');

    await userEvent.click(loginBtn);

    await sleep(3000);

    expect(canvas.getByText('ChatChannelArea'));
  },
};
