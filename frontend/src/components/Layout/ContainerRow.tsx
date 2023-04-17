import { ReactNode } from "react";

export const ContainerRow = ({ children }: { children: ReactNode }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                flex: "1",
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};
