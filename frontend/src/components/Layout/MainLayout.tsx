import { ReactNode } from "react";

import { Container } from "./Container";
import { ContainerItem } from "./ContainerItem";

export const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <Container flexDirection={"column"}>
            <div>
                <h1>Header</h1>
                <hr />
            </div>
            <ContainerItem>{children}</ContainerItem>
            <div>
                <hr />
                <h1>Footer</h1>
            </div>
        </Container>
    );
};
