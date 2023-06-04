'use client';
import { useEffect } from 'react';

import { useInterval } from '@/hooks/useInterval';
import { useCanvas } from '@/hooks/useCanvas';

import { Ball, Paddle, KeyAction } from './Types';

const DrawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
};

const DrawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
};

const IsInRange = (pos: number, start: number, end: number) => {
  return start < pos && pos < end;
};

const UpdateBallPosition = (ball: Ball, width: number, height: number) => {
  if (!IsInRange(ball.x + ball.dx, ball.radius, width - ball.radius)) {
    ball.dx = -ball.dx;
  }
  if (!IsInRange(ball.y + ball.dy, ball.radius, height - ball.radius)) {
    ball.dy = -ball.dy;
  }
  ball.x += ball.dx;
  ball.y += ball.dy;
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

  const leftPaddle: Paddle = {
    x: 0,
    y: 0,
    width: 10,
    height: 100,
    speed: 10,
  };

  const rightPaddle: Paddle = {
    x: width - 10,
    y: 0,
    width: 10,
    height: 100,
    speed: 10,
  };

  // 一旦どっちも動かす
  const UpKeyAction = new KeyAction(() => {
    leftPaddle.y -= 5;
    rightPaddle.y -= 5;
  });

  const DownKeyAction = new KeyAction(() => {
    leftPaddle.y += 5;
    rightPaddle.y += 5;
  });

  const { canvas, ctx } = useCanvas(canvasId);

  useEffect(() => {
    if (canvas === null) {
      return;
    }
    canvas.style.border = '4px solid';
    canvas.style.color = 'black';
  }, [canvas]);

  // TODO vectorで書き換え
  useInterval(() => {
    if (ctx === null || canvas == null) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    UpKeyAction.Run();
    DownKeyAction.Run();
    DrawPaddle(ctx, leftPaddle);
    DrawPaddle(ctx, rightPaddle);
    DrawBall(ctx, ball);
    UpdateBallPosition(ball, canvas.width, canvas.height);
  }, 10);

  // [1] Edge (16 and earlier) and Firefox (36 and earlier) use "Left", "Right", "Up", and "Down" instead of "ArrowLeft", "ArrowRight", "ArrowUp", and "ArrowDown".
  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
      console.log('press u');
      UpKeyAction.SetOn();
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      console.log('press d');
      DownKeyAction.SetOn();
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
      console.log('release u');
      UpKeyAction.SetOff();
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      console.log('release d');
      DownKeyAction.SetOff();
    }
  };

  // TODO 何処に置くべきか分からん
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  return <canvas width={width} height={height} id={canvasId}></canvas>;
};
