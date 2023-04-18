import { ChangeEvent } from "react";

import { Input } from "../../components/Elements/Input/Input";
import { SendButton } from "../../components/Elements/Button/SendButton";

import { ContainerRow } from "../../components/Layout/ContainerRow";

export const ChatInput = ({
    msg,
    onChangeAct,
    sendBtnAct,
}: {
    msg: string;
    onChangeAct: (e: ChangeEvent<HTMLInputElement>) => void;
    sendBtnAct: () => void;
}) => {
    return (
        <>
            <div>
                <ContainerRow>
                    <Input msg={msg} onChangeAct={onChangeAct} />
                    <SendButton sendBtnAct={sendBtnAct} />
                </ContainerRow>
            </div>
        </>
    );
};
