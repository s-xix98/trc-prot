import type { Meta, StoryObj } from "@storybook/react";

import { Container } from "./Container";
import { ContainerItem } from "./ContainerItem";

const meta = {
    component: Container,
    tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof Container>;

export const Basic: Story = {
    args: {
        flexDirection: "row",
        children: (
            <>
                <ContainerItem>
                    <div
                        style={{ backgroundColor: "firebrick", height: "100%" }}
                    >
                        <p>one</p>
                    </div>
                </ContainerItem>
                <ContainerItem flexRatio={2}>
                    <div
                        style={{
                            backgroundColor: "deepskyblue",
                            height: "100%",
                        }}
                    >
                        <p>two</p>
                    </div>
                </ContainerItem>
            </>
        ),
    },
};
