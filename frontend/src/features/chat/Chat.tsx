import { ChatChannelArea } from "./ChatChannelArea";
import { ChatToakArea } from "./ChatTalkArea";

export const Chat = () => {
    return (
        <div
            style={{
                display: "flex",
                flex: "1",
                border: "solid",
                overflow: "hidden",
            }}
        >
            <div style={{ borderRight: "solid", flex: "1", display: "flex" }}>
                <ChatChannelArea />
            </div>
            <div style={{ borderRight: "solid", flex: "4", display: "flex" }}>
                <ChatToakArea />
            </div>
        </div>
    );
};
