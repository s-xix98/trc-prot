import type { Meta, StoryObj } from '@storybook/react';

import { ModalView } from './ModalView';

const meta = {
  component: ModalView,
  tags: ['autodocs'],
} satisfies Meta<typeof ModalView>;

export default meta;

type Story = StoryObj<typeof ModalView>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <h1>sample</h1>
      </>
    ),
    modalIsOpen: true,
  },
};
