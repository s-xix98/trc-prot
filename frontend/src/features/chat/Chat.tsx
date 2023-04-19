import { ChatChannelArea } from "./ChatChannelArea";
import { ChatTalkArea } from "./ChatTalkArea";

import { ContainerRow } from "../../components/Layout/ContainerRow";
import { ContainerItem } from "../../components/Layout/ContainerItem";

export const Chat = () => {
    return (
        <ContainerRow>
            <ContainerItem flexRatio={1}>
                <ChatChannelArea />
            </ContainerItem>
            <ContainerItem flexRatio={4}>
                <ChatTalkArea />
            </ContainerItem>
        </ContainerRow>
    );
};
