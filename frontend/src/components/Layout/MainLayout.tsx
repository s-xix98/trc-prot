import { ReactNode } from "react";

import { ContainerCol } from "./ContainerCol";

export const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <ContainerCol>
            <div>
                <h1>Header</h1>
                <hr />
            </div>
            {children}
            <div>
                <hr />
                <h1>Footer</h1>
            </div>
        </ContainerCol>
    );
};
