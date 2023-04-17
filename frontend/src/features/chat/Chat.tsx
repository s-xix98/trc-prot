import { ChatChannelArea } from "./ChatChannelArea";
import { ChatToakArea } from "./ChatTalkArea";

import { ContainerRow } from "../../components/Layout/ContainerRow";

export const Chat = () => {
    return (
        <ContainerRow>
            <div style={{ borderRight: "solid", flex: "1", display: "flex" }}>
                <ChatChannelArea />
            </div>
            <div style={{ borderRight: "solid", flex: "4", display: "flex" }}>
                <ChatToakArea />
            </div>
        </ContainerRow>
    );
};
