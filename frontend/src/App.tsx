import { useEffect } from "react";

import { socket } from "./socket";
import { Chat } from "./features/chat/Chat";

import { MainLayout } from "./components/Layout/MainLayout";

const onConnect = () => {
    console.log("socket connect");
};

const onDisconnect = () => {
    console.log("socket disconnect");
};

function App() {
    useEffect(() => {
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return (
        <MainLayout>
            <Chat />
        </MainLayout>
    );
}

export default App;
