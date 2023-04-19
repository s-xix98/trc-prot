import { useState, useEffect } from "react";

export const Counter = () => {
    const [counter, setCounter] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((c) => c + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    console.log(counter);

    return <h3>Counter : {counter}</h3>;
};
