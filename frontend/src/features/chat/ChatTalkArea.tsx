import { ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";

import { socket } from "../../socket";

import { ContainerCol } from "../../components/Layout/ContainerCol";

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
    const clientHeight = scrollParentElement.clientHeight;

    // debug
    // console.log("scrollHeight", scrollHeight);
    // console.log("scrollTop", scrollTop);
    // console.log("clientHeight", clientHeight);
    // console.log(scrollTop + clientHeight);

    // TODO : is it ok to return false?
    if (
        scrollHeight === undefined ||
        scrollTop === undefined ||
        clientHeight === undefined
    ) {
        return false;
    }

    const isBtm = Math.abs(scrollHeight - (scrollTop + clientHeight)) <= 1;

    return isBtm;
};

export const ChatTalkArea = () => {
    const [msg, setMsg] = useState("");
    const [chatHistMsgs, setchatHistMsgs] = useState<string[]>([]);

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
        setchatHistMsgs((chatHistMsgs) => [...chatHistMsgs, data]);
        console.log("needScroll", needScroll);
    };

    useEffect(() => {
        socket.on("message", onMessage);

        return () => {
            socket.off("message", onMessage);
        };
    }, []);

    return (
        <ContainerCol>
            <h2>ChatTalkArea</h2>
            <hr />
            <ChatHistory
                chatHistMsgs={chatHistMsgs}
                isNeedScroll={isNeedScroll}
                scrollBottomRef={scrollBottomRef}
            />
            <ChatInput
                msg={msg}
                onChangeAct={onChangeAct}
                sendBtnAct={sendBtnAct}
            />
        </ContainerCol>
    );
};
