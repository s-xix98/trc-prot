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

const IsInRange = (pos: number, start: number, end: number) => {
  return start < pos && pos < end;
};

const Game = () => {
  const width = 400;
  const height = 400;
  const canvasId = 'canvas';
  // TODO ballClass
  const ballRadius = 10;
  let ballX = width / 2;
  let ballY = height / 2;
  let dx = 2;
  let dy = 0.5;

  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    canvas.style.border = '4px solid';
    canvas.style.color = 'black';
    const canvasContext = canvas.getContext('2d');
    setContext(canvasContext);
  }, []);

  // TODO vectorで書き換え
  useInterval(() => {
    if (ctx === null) {
      return;
    }
    ctx.clearRect(0, 0, width, height);
    DrawBall(ctx, ballX, ballY, 10);
    if (!IsInRange(ballX + dx, ballRadius, width - ballRadius)) {
      dx = -dx;
    }
    if (!IsInRange(ballY + dy, ballRadius, height - ballRadius)) {
      dy = -dy;
    }
    ballX += dx;
    ballY += dy;
  }, 10);

  return <canvas width={width} height={height} id={canvasId}></canvas>;
};

export default Game;
