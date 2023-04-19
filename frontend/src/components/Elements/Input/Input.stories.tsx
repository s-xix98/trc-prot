import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./Input";

const meta = {
    component: Input,
    tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

export const Basic: Story = {};
