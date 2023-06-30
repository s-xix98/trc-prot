import type { Meta, StoryObj } from '@storybook/react';

import { Friends } from './Friends';

const meta = {
    component: Friends,
    tags: ['autodocs'],
} satisfies Meta<typeof Friends>;

export default meta;

type Story = StoryObj<typeof Friends>;

export const Basic: Story = {};
