import { ChatChannelArea } from "./ChatChannelArea";
import { ChatToakArea } from "./ChatTalkArea";

import { ContainerRow } from "../../components/Layout/ContainerRow";
import { ContainerItem } from "../../components/Layout/ContainerItem";

export const Chat = () => {
    return (
        <ContainerRow>
            <ContainerItem flexRatio={1}>
                <ChatChannelArea />
            </ContainerItem>
            <ContainerItem flexRatio={4}>
                <ChatToakArea />
            </ContainerItem>
        </ContainerRow>
    );
};
