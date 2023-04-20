import type { Meta, StoryObj } from "@storybook/react";

import { MainLayout } from "./MainLayout";

const meta = {
    component: MainLayout,
    tags: ["autodocs"],
} satisfies Meta<typeof MainLayout>;

export default meta;

type Story = StoryObj<typeof MainLayout>;

export const Basic: Story = {
    args: {
        children: <h1>hoge</h1>,
    },
};
