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

export const SelectChannel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loginBtn = canvas.getByText('login as fuga');
    await userEvent.click(loginBtn);
    await sleep(3000);

    const hoge0 = canvas.getByText('hoge 0');
    await userEvent.click(hoge0);
  },
};

export const SendMsg: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loginBtn = canvas.getByText('login as fuga');
    await userEvent.click(loginBtn);
    await sleep(3000);

    const hoge0 = canvas.getByText('hoge 0');
    await userEvent.click(hoge0);

    const inputElem =
      canvas.getByTestId('input-test-id')?.firstElementChild?.firstElementChild;
    if (inputElem === undefined || inputElem === null) {
      expect(false);
      return;
    }
    await userEvent.type(inputElem, 'This is test msg');
    await userEvent.click(canvas.getByText('Send'));
    // SEND ボタンに アニメーションがあり、スクショのタイミングによって
    // スクショに若干の差異が生まれ テストが落ちてしまうので 適当に Footer を クリック
    await userEvent.click(canvas.getByText('Footer'));
  },
};

export const SendSomeMsg: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loginBtn = canvas.getByText('login as fuga');
    await userEvent.click(loginBtn);
    await sleep(3000);

    const hoge0 = canvas.getByText('hoge 0');
    await userEvent.click(hoge0);

    const inputElem =
      canvas.getByTestId('input-test-id')?.firstElementChild?.firstElementChild;
    if (inputElem === undefined || inputElem === null) {
      expect(false);
      return;
    }
    for (let i = 0; i < 30; i++) {
      await userEvent.type(inputElem, `This is test msg ${i}`);
      await userEvent.click(canvas.getByText('Send'));
    }
    // SEND ボタンに アニメーションがあり、スクショのタイミングによって
    // スクショに若干の差異が生まれ テストが落ちてしまうので 適当に Footer を クリック
    await userEvent.click(canvas.getByText('Footer'));
  },
};
