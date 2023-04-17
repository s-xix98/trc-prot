import { useLayoutEffect } from "react";

import { ContainerCol } from "../../components/Layout/ContainerCol";

export const ChatHistory = ({
    chatHistMsgs,
    isNeedScroll,
    scrollBottomRef,
}: {
    chatHistMsgs: string[];
    isNeedScroll: boolean;
    scrollBottomRef: React.RefObject<HTMLDivElement>;
}) => {
    useLayoutEffect(() => {
        if (isNeedScroll === true) {
            scrollBottomRef?.current?.scrollIntoView();
        }
    }, [chatHistMsgs]);

    return (
        <ContainerCol>
            <div style={{ flex: "1", overflowY: "scroll" }}>
                {chatHistMsgs.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
                <div ref={scrollBottomRef}></div>
            </div>
        </ContainerCol>
    );
};
