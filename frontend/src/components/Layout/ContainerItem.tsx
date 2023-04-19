import { ReactNode } from "react";

export const ContainerItem = ({
    children,
    flex = "auto",
    flexRatio = 1,
    overflowX = "hidden",
    overflowY = "hidden",
}: {
    children: ReactNode;
    flex?: "auto" | "flex";
    flexRatio?: number;
    overflowX?: "hidden" | "scroll";
    overflowY?: "hidden" | "scroll";
}) => {
    return (
        <>
            <div
                style={{
                    display: flex,
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
