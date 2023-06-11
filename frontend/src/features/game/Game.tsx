'use client';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useInterval } from '@/hooks/useInterval';

import { Ball, Paddle } from './Types';
import { Keys, keyActions } from './KeyAction';

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

const UpdateBallPosition = (
  ball: Ball,
  width: number,
  height: number,
  setGameOver: () => void,
) => {
  if (!IsInRange(ball.x + ball.dx, ball.radius, width - ball.radius)) {
    setGameOver();
  }
  if (!IsInRange(ball.y + ball.dy, ball.radius, height - ball.radius)) {
    ball.dy = -ball.dy;
  }
  ball.x += ball.dx;
  ball.y += ball.dy;
};

const StyledCanvas = styled.canvas`
  border: 4px solid;
  color: black;
`;

const HandleKeyActions = (
  keyInputs: boolean[],
  leftPaddle: Paddle,
  rightPaddle: Paddle,
  canvas: HTMLCanvasElement,
) => {
  // 一旦どっちも動かす
  if (keyInputs[Keys.Up]) {
    keyActions[Keys.Up](leftPaddle);
    keyActions[Keys.Up](rightPaddle);
  }
  if (keyInputs[Keys.Down]) {
    keyActions[Keys.Down](leftPaddle, canvas.height);
    keyActions[Keys.Down](rightPaddle, canvas.height);
  }
};

const GameCanvas = ({ setGameOver }: { setGameOver: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 400;
  const height = 400;
  const canvasId = 'canvas';
  const keyInputs: boolean[] = [];

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

  // TODO vectorで書き換え
  useInterval(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      throw new Error('no canvas');
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    HandleKeyActions(keyInputs, leftPaddle, rightPaddle, canvas);
    DrawPaddle(ctx, leftPaddle);
    DrawPaddle(ctx, rightPaddle);
    DrawBall(ctx, ball);
    UpdateBallPosition(ball, canvas.width, canvas.height, setGameOver);
  }, 10);

  // [1] Edge (16 and earlier) and Firefox (36 and earlier) use "Left", "Right", "Up", and "Down" instead of "ArrowLeft", "ArrowRight", "ArrowUp", and "ArrowDown".
  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
      console.log('press u');
      keyInputs[Keys.Up] = true;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      console.log('press d');
      keyInputs[Keys.Down] = true;
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
      console.log('release u');
      keyInputs[Keys.Up] = false;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      console.log('release d');
      keyInputs[Keys.Down] = false;
    }
  };

  // TODO 何処に置くべきか分からん
  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    return () => {
      document.removeEventListener('keydown', keyDownHandler, false);
      document.removeEventListener('keyup', keyUpHandler, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <StyledCanvas
      ref={canvasRef}
      width={width}
      height={height}
      id={canvasId}
    ></StyledCanvas>
  );
};

export const Game = () => {
  const [isGameOver, setGameOver] = useState(false);
  return (
    <>
      {isGameOver && <h1>GameOver</h1>}
      {!isGameOver && <GameCanvas setGameOver={() => setGameOver(true)} />}
    </>
  );
};
