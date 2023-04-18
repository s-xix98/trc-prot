import { useLayoutEffect } from "react";

import { ContainerCol } from "../../components/Layout/ContainerCol";
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
        <ContainerCol>
            <ContainerScrollItem>
                {chatHistMsgs.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
                <div ref={scrollBottomRef}></div>
            </ContainerScrollItem>
        </ContainerCol>
    );
};
