import { ChatChannelArea } from "./ChatChannelArea";
import { ChatTalkArea } from "./ChatTalkArea";

import { Container } from "../../components/Layout/Container";
import { ContainerItem } from "../../components/Layout/ContainerItem";

export const Chat = () => {
    return (
        <Container>
            <ContainerItem flex={"flex"} flexRatio={1}>
                <ChatChannelArea />
            </ContainerItem>
            <ContainerItem flex={"flex"} flexRatio={4}>
                <ChatTalkArea />
            </ContainerItem>
        </Container>
    );
};
