import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, screen } from '@storybook/testing-library';

import Home from './page';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const meta = {
  component: Home,
  tags: ['autodocs'],
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof Home>;

export const Basic: Story = {};

// TODO : mui modal が このテスト対象のコンポーネントの下に、エレメントを作成せず、
// canvas.getXXXでエレメントが取得できないので、screen からエレメント取得
// mui modal のエレメント取得する方法等考える

export const Login: Story = {
  play: async () => {
    const loginBtn = screen.getByText('login as fuga');
    await userEvent.click(loginBtn);
    await sleep(1000);
  },
};

// TODO : login 周り改善したら、復活させるかも
// e2eでテストしてるので一旦コメントアウト
// socketが、undef になって ルームの取得がうまくできてないみたい

// export const SelectChannel: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     const terminalInputElem = canvas.getByRole('textbox');
//     if (terminalInputElem === undefined || terminalInputElem === null) {
//       expect(false);
//       return;
//     }
//     await userEvent.type(terminalInputElem, './chat');
//     await userEvent.keyboard('{enter}');

//     const hogeRoom = await screen.findByText('hogeRoom');
//     await userEvent.click(hogeRoom);

//     await sleep(1000);
//   },
// };

// export const SendMsg: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     const terminalInputElem = canvas.getByRole('textbox');
//     if (terminalInputElem === undefined || terminalInputElem === null) {
//       expect(false);
//       return;
//     }
//     await userEvent.type(terminalInputElem, './chat');
//     await userEvent.keyboard('{enter}');

//     const hogeRoom = await screen.findByText('hogeRoom');
//     await userEvent.click(hogeRoom);

//     // TODO : chat hist をとるまで一旦待つように
//     await sleep(3000);

//     const inputElem = screen.getByRole('textbox');
//     if (inputElem === undefined || inputElem === null) {
//       expect(false);
//       return;
//     }
//     await userEvent.type(inputElem, 'This is test msg');
//     await userEvent.keyboard('{enter}');

//     await sleep(1000);
//   },
// };

// export const SendSomeMsg: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     const terminalInputElem = canvas.getByRole('textbox');
//     if (terminalInputElem === undefined || terminalInputElem === null) {
//       expect(false);
//       return;
//     }
//     await userEvent.type(terminalInputElem, './chat');
//     await userEvent.keyboard('{enter}');

//     const hogeRoom = await screen.findByText('hogeRoom');
//     await userEvent.click(hogeRoom);

//     // TODO : chat hist をとるまで一旦待つように
//     await sleep(3000);

//     const inputElem = screen.getByRole('textbox');
//     if (inputElem === undefined || inputElem === null) {
//       expect(false);
//       return;
//     }
//     for (let i = 0; i < 50; i++) {
//       await userEvent.type(inputElem, `This is test msg ${i}`);
//       await userEvent.keyboard('{enter}');
//     }

//     await sleep(1000);
//   },
// };

// // SendSomeMsg で メッセージ送信したチャンネル再度開いて一番下にスクロールされるか
// export const CheckScroll: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     const terminalInputElem = canvas.getByRole('textbox');
//     if (terminalInputElem === undefined || terminalInputElem === null) {
//       expect(false);
//       return;
//     }
//     await userEvent.type(terminalInputElem, './chat');
//     await userEvent.keyboard('{enter}');

//     const hogeRoom = await screen.findByText('hogeRoom');
//     await userEvent.click(hogeRoom);

//     await sleep(1000);
//   },
// };
