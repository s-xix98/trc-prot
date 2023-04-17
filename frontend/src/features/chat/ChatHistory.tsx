import { useLayoutEffect } from "react";

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
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "scroll",
                }}
            >
                {chatHist.map((msg, idx) => (
                    <div key={idx} style={{ display: "flex" }}>
                        <p
                            style={{
                                margin: "5px",
                                padding: "3px",
                                backgroundColor: "gray",
                            }}
                        >
                            {msg}
                        </p>
                    </div>
                ))}
                <div ref={scrollBottomRef} />
            </div>
        </>
    );
};
