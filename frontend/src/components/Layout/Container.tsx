import { ReactNode } from "react";

export const Container = ({
    children,
    isColumn = false,
}: {
    children: ReactNode;
    isColumn?: boolean;
}) => {
    const flexDirection = isColumn ? "column" : "row";

    return (
        <div
            style={{
                flex: "1",
                display: "flex",
                flexDirection: flexDirection,
                overflow: "hidden",
                height: "100%",
            }}
        >
            {children}
        </div>
    );
};
