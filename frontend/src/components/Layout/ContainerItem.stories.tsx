import type { Meta, StoryObj } from '@storybook/react';

import { ContainerItem } from './ContainerItem';

const meta = {
  component: ContainerItem,
  tags: ['autodocs'],
} satisfies Meta<typeof ContainerItem>;

export default meta;

type Story = StoryObj<typeof ContainerItem>;

const items: string[] = [];
for (let n = 0; n < 100; n++) {
  items.push(`hoge ${n}`);
}

export const Basic: Story = {
  args: {
    children: (
      <>
        {items.map((item, idx) => (
          <p key={idx}>{item}</p>
        ))}
      </>
    ),
  },
};
