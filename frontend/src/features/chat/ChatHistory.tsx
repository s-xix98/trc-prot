import { useLayoutEffect } from "react";

import { Container } from "../../components/Layout/Container";
import { ContainerScrollItem } from "../../components/Layout/ContainerScrollItem";

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
        <Container isColumn={true}>
            <ContainerScrollItem>
                {chatHistMsgs.map((msg, idx) => (
                    <p key={idx} style={{ overflowWrap: "break-word" }}>
                        {msg}
                    </p>
                ))}
                <div ref={scrollBottomRef}></div>
            </ContainerScrollItem>
        </Container>
    );
};
