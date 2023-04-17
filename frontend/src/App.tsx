import { useEffect } from "react";

import { socket } from "./socket";
import { Chat } from "./features/chat/Chat";

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
        <>
            <div style={{ height: "5%" }}>
                <h1>Header</h1>
                <hr />
            </div>
            <div style={{ height: "90%" }}>
                <Chat />
            </div>
            <div style={{ height: "5%" }}>
                <hr />
                <h3>footer</h3>
            </div>
        </>
    );
}

export default App;
