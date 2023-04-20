import { ReactNode } from "react";

export const ContainerItem = ({
    children,
    display = "auto",
    flexRatio = 1,
    overflowX = "hidden",
    overflowY = "hidden",
}: {
    children: ReactNode;
    display?: "auto" | "flex";
    flexRatio?: number;
    overflowX?: "hidden" | "scroll";
    overflowY?: "hidden" | "scroll";
}) => {
    return (
        <>
            <div
                style={{
                    display: display,
                    flex: flexRatio,
                    overflowX: overflowX,
                    overflowY: overflowY,
                }}
            >
                {children}
            </div>
        </>
    );
};
