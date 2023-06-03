'use client';
import { useEffect, useState } from 'react';

const DrawBall = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
};

const Game = () => {
  const width = 400;
  const height = 400;
  const canvasId = 'canvas';
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    canvas.style.border = '4px solid';
    canvas.style.color = 'black';
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  }, []);

  useEffect(() => {
    if (ctx === null) {
      return;
    }
    DrawBall(ctx, width / 2, height / 2, 10);
  });

  return <canvas width={width} height={height} id={canvasId}></canvas>;
};

export default Game;
