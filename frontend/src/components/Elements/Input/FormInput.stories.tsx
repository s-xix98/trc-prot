import type { Meta, StoryObj } from '@storybook/react';

import { FormInput } from './FormInput';

const meta = {
  component: FormInput,
  tags: ['autodocs'],
} satisfies Meta<typeof FormInput>;

export default meta;

type Story = StoryObj<typeof FormInput>;

export const Basic: Story = {
  args: {
    name: 'name',
    type: 'text',
  },
};
