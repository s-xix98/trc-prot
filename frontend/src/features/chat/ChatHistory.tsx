import { useLayoutEffect } from "react";

import { Container } from "../../components/Layout/Container";

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
        <Container>
            <div style={{ flex: "1", overflowY: "scroll" }}>
                {chatHistMsgs.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
                <div ref={scrollBottomRef}></div>
            </div>
        </Container>
    );
};
