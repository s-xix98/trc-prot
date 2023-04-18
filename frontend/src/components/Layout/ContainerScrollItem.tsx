import { ReactNode } from "react";

export const ContainerScrollItem = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <div style={{ flex: "1", overflowY: "scroll" }}>{children}</div>
        </>
    );
};
