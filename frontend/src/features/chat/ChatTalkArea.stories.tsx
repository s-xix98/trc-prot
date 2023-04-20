import type { Meta, StoryObj } from "@storybook/react";

import { ChatTalkArea } from "./ChatTalkArea";

const meta = {
    component: ChatTalkArea,
    tags: ["autodocs"],
} satisfies Meta<typeof ChatTalkArea>;

export default meta;

type Story = StoryObj<typeof ChatTalkArea>;

export const Basic: Story = {};
