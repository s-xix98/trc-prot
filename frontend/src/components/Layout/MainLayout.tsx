import { ReactNode } from "react";

import { Container } from "./Container";

export const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <Container isColumn={true}>
            <div>
                <h1>Header</h1>
                <hr />
            </div>
            {children}
            <div>
                <hr />
                <h1>Footer</h1>
            </div>
        </Container>
    );
};
