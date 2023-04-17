import { useLayoutEffect } from "react";

import { Container } from "../../components/Layout/Container";

export const ChatHistory = ({
    chatHist,
    isNeedScroll,
    scrollBottomRef,
}: {
    chatHist: string[];
    isNeedScroll: boolean;
    scrollBottomRef: React.RefObject<HTMLDivElement>;
}) => {
    useLayoutEffect(() => {
        if (isNeedScroll === true) {
            scrollBottomRef?.current?.scrollIntoView();
        }
    }, [chatHist]);

    return (
        <Container>
            <div style={{ flex: "1", overflowY: "scroll" }}>
                {chatHist.map((msg, idx) => (
                    <p>{msg}</p>
                ))}
            </div>
        </Container>
    );
};
