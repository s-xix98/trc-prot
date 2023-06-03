'use client';
import { useEffect, useState } from 'react';

import { useInterval } from '@/hooks/useInterval';

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
  let ballX = width / 2;
  let ballY = height / 2;

  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    canvas.style.border = '4px solid';
    canvas.style.color = 'black';
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  }, []);

  useInterval(() => {
    if (ctx === null) {
      return;
    }
    DrawBall(ctx, ballX, ballY, 10);
    ballX += 1;
    ballY += 1;
  }, 10);

  return <canvas width={width} height={height} id={canvasId}></canvas>;
};

export default Game;
