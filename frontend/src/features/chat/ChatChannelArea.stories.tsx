import type { Meta, StoryObj } from "@storybook/react";

import { ChatChannelArea } from "./ChatChannelArea";

const meta = {
    component: ChatChannelArea,
    tags: ["autodocs"],
} satisfies Meta<typeof ChatChannelArea>;

export default meta;

type Story = StoryObj<typeof ChatChannelArea>;

export const Basic: Story = {};
