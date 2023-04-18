import { ReactNode } from "react";

export const ContainerItem = ({
    flexRatio,
    children,
}: {
    flexRatio: number;
    children: ReactNode;
}) => {
    return (
        <>
            <div style={{ flex: flexRatio, display: "flex" }}>{children}</div>
        </>
    );
};
