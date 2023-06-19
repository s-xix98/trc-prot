import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import Home from './page';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const meta = {
  component: Home,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof Home>;

export const Basic: Story = {};

// TODO : mui modal が このテスト対象のコンポーネントの下に、エレメントを作成せず、
// canvas.getXXXでエレメントが取得できないので、screen からエレメント取得
// mui modal のエレメント取得する方法等考える

export const Login: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const terminalInputElem = canvas.getByTestId('terminal-input-test-id');
    if (terminalInputElem === undefined || terminalInputElem === null) {
      expect(false);
      return;
    }
    await userEvent.type(terminalInputElem, 'p\n');

    const loginBtn = screen.getByText('login as fuga');
    await userEvent.click(loginBtn);
    await sleep(1000);
    expect(screen.getByText('ChatChannelArea'));
  },
};

export const SelectChannel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const terminalInputElem = canvas.getByTestId('terminal-input-test-id');
    if (terminalInputElem === undefined || terminalInputElem === null) {
      expect(false);
      return;
    }
    await userEvent.type(terminalInputElem, 'p\n');

    const hogeRoom = await screen.findByText('hogeRoom');
    await userEvent.click(hogeRoom);

    await sleep(1000);
  },
};

export const SendMsg: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const terminalInputElem = canvas.getByTestId('terminal-input-test-id');
    if (terminalInputElem === undefined || terminalInputElem === null) {
      expect(false);
      return;
    }
    await userEvent.type(terminalInputElem, 'p\n');

    const hogeRoom = await screen.findByText('hogeRoom');
    await userEvent.click(hogeRoom);

    // TODO : chat hist をとるまで一旦待つように
    await sleep(3000);

    const inputElem =
      screen.getByTestId('input-test-id')?.firstElementChild?.firstElementChild;
    if (inputElem === undefined || inputElem === null) {
      expect(false);
      return;
    }
    await userEvent.type(inputElem, 'This is test msg');
    await userEvent.click(screen.getByText('Send'));

    // SEND ボタンに アニメーションがあり、スクショのタイミングによって
    // スクショに若干の差異が生まれ テストが落ちてしまうので 適当に Footer を クリック
    await userEvent.click(canvas.getByText('Footer'));

    await sleep(1000);
  },
};

export const SendSomeMsg: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const terminalInputElem = canvas.getByTestId('terminal-input-test-id');
    if (terminalInputElem === undefined || terminalInputElem === null) {
      expect(false);
      return;
    }
    await userEvent.type(terminalInputElem, 'p\n');

    const hogeRoom = await screen.findByText('hogeRoom');
    await userEvent.click(hogeRoom);

    // TODO : chat hist をとるまで一旦待つように
    await sleep(3000);

    const inputElem =
      screen.getByTestId('input-test-id')?.firstElementChild?.firstElementChild;
    if (inputElem === undefined || inputElem === null) {
      expect(false);
      return;
    }
    for (let i = 0; i < 30; i++) {
      await userEvent.type(inputElem, `This is test msg ${i}`);
      await userEvent.click(screen.getByText('Send'));
    }

    // SEND ボタンに アニメーションがあり、スクショのタイミングによって
    // スクショに若干の差異が生まれ テストが落ちてしまうので 適当に Footer を クリック
    await userEvent.click(canvas.getByText('Footer'));

    await sleep(1000);
  },
};
