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
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.style.border = '4px solid';
    canvas.style.color = 'black';
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  }, []);

  useEffect(() => {
    if (ctx === null) {
      return;
    }
    DrawBall(ctx, 400 / 2, 400 / 2, 10);
  });

  return <canvas width={400} height={400} id={'canvas'}></canvas>;
};

export default Game;
