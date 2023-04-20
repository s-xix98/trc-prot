import { ChangeEvent } from "react";

import { Input } from "../../components/Elements/Input/Input";
import { SendButton } from "../../components/Elements/Button/SendButton";

import { Container } from "../../components/Layout/Container";

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
                <Container>
                    <Input msg={msg} onChangeAct={onChangeAct} />
                    <SendButton sendBtnAct={sendBtnAct} />
                </Container>
            </div>
        </>
    );
};
