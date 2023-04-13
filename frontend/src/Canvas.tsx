import { useState, useEffect } from "react";

const drawBox = (ctx: CanvasRenderingContext2D) => {
    const boxWidth = 200;
    const boxHeight = 200;

    ctx.fillStyle = "red";
    ctx.fillRect(50, 50, boxWidth, boxHeight);

    ctx.fillStyle = "blue";
    ctx.fillRect(100, 100, boxWidth, boxHeight);

    ctx.fillStyle = "yellow";
    ctx.fillRect(150, 150, boxWidth, boxHeight);
};

export const Canvas = () => {
    const width = 600;
    const height = 600;

    const canvasId = "canvasId";

    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvasElement = document.getElementById(
            canvasId
        ) as HTMLCanvasElement;
        const ctx = canvasElement?.getContext("2d");
        console.log("ctx", ctx);
        setCtx(ctx);
    }, []);

    useEffect(() => {
        console.log("ctx update", ctx);
        if (ctx === null) {
            return;
        }
        ctx.fillStyle = "silver";
        ctx.fillRect(0, 0, width, height);
        drawBox(ctx);
    }, [ctx]);

    return (
        <>
            <div style={{ backgroundColor: "gray" }}>
                <h3>CanvasArea</h3>
                <canvas
                    style={{ padding: "1em" }}
                    id={canvasId}
                    width={width}
                    height={height}
                />
            </div>
        </>
    );
};
