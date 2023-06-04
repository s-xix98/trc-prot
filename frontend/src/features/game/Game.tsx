'use client';
import { useEffect, useState } from 'react';

import { useInterval } from '@/hooks/useInterval';

import { Ball } from './Types';

const DrawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
};

const IsInRange = (pos: number, start: number, end: number) => {
  return start < pos && pos < end;
};

export const Game = () => {
  const width = 400;
  const height = 400;
  const canvasId = 'canvas';
  const ball: Ball = {
    x: width / 2,
    y: height / 2,
    radius: 10,
    dx: 2,
    dy: 0.5,
  };

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
    DrawBall(ctx, ball);
    if (!IsInRange(ball.x + ball.dx, ball.radius, width - ball.radius)) {
      ball.dx = -ball.dx;
    }
    if (!IsInRange(ball.y + ball.dy, ball.radius, height - ball.radius)) {
      ball.dy = -ball.dy;
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
  }, 10);

  return <canvas width={width} height={height} id={canvasId}></canvas>;
};
