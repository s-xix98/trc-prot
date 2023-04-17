import { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
    return (
        <div
            style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};
