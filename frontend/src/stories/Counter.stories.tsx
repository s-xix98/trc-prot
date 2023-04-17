import { Counter } from "../Counter";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Counter> = {
    title: "a",
    component: Counter,
};

export default meta;

type Story = StoryObj<typeof Counter>;

export const FirstStroy: Story = {};
