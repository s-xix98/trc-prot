import type { Meta, StoryObj } from '@storybook/react';

import RootLayout from './layout';

const meta = {
  component: RootLayout,
  tags: ['autodocs'],
} satisfies Meta<typeof RootLayout>;

export default meta;

type Story = StoryObj<typeof RootLayout>;

// TODO : storybook addon-coverage を入れたら、エラーが出るようになった
// 重要でないので一旦コメントアウト
// `layout.txt` で Inter をうまく読み込めてない？
// export const Basic: Story = {};
