import { useEffect } from "react";

import { socket } from "./socket";
import { Canvas } from "./Canvas";

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
            <h1>Header</h1>
            <hr />
            <Canvas />
        </>
    );
}

export default App;
