import { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};
