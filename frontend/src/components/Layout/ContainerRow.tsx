import { ReactNode } from "react";

export const ContainerRow = ({ children }: { children: ReactNode }) => {
    return (
        <div
            style={{
                flex: "1",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};
