import { ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";

import { socket } from "../../socket";

import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";

const isScrollBottom = (scrollBottomRef: React.RefObject<HTMLDivElement>) => {
    const scrollParentElement = scrollBottomRef?.current?.parentElement;

    // TODO : is it ok to return false?
    if (scrollParentElement === undefined || scrollParentElement === null) {
        return false;
    }
    const scrollHeight = scrollParentElement.scrollHeight;
    const scrollTop = scrollParentElement.scrollTop;
    const offsetHeight = scrollParentElement.offsetHeight;

    // debug
    // console.log("scrollHeight", scrollHeight);
    // console.log("scrollTop", scrollTop);
    // console.log("offsetHeight", offsetHeight);
    // console.log(scrollTop + offsetHeight);

    // TODO : is it ok to return false?
    if (
        scrollHeight === undefined ||
        scrollTop === undefined ||
        offsetHeight === undefined
    ) {
        return false;
    }

    const isBtm = Math.abs(scrollHeight - (scrollTop + offsetHeight)) <= 1;

    return isBtm;
};

export const Chat = () => {
    const [msg, setMsg] = useState("");
    const [rcvMsg, setRcvMsg] = useState<string[]>([]);

    const scrollBottomRef = useRef<HTMLDivElement>(null);
    const [isNeedScroll, setIsNeedScroll] = useState(false);

    const onChangeAct = (e: ChangeEvent<HTMLInputElement>) => {
        // TODO : Shift + Enter で 改行を入れられるようにとかしたい
        if (e.target.value.slice(-1) === "\n") {
            if (e.target.value.length === 1) {
                return;
            }
            sendBtnAct();
            return;
        }
        setMsg(e.target.value);
    };

    const sendBtnAct = () => {
        socket.emit("message", msg);
        setMsg("");
    };

    const onMessage = (data: string) => {
        const needScroll = isScrollBottom(scrollBottomRef);
        setIsNeedScroll(() => needScroll);
        setRcvMsg((rcvMsg) => [...rcvMsg, data]);
        console.log("needScroll", needScroll);
    };

    useEffect(() => {
        socket.on("message", onMessage);

        return () => {
            socket.off("message", onMessage);
        };
    }, []);

    return (
        <div style={{ height: "100%" }}>
            <h3>ChatArea</h3>
            <div style={{ height: "90%" }}>
                <ChatHistory
                    chatHist={rcvMsg}
                    isNeedScroll={isNeedScroll}
                    scrollBottomRef={scrollBottomRef}
                />
            </div>
            <div style={{ height: "10%" }}>
                <ChatInput
                    msg={msg}
                    sendBtnAct={sendBtnAct}
                    onChangeAct={onChangeAct}
                />
            </div>
        </div>
    );
};
