'use client';
// import { useEffect, useRef, useState } from 'react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { socket } from '@/socket';
import { useSocket } from '@/hooks/useSocket';
import { Container } from '@/components/Layout/Container';

import { Ball, GameObjects, Paddle } from './Types';
import { BallDto, GameDto, PaddleDto } from './dto/GameDto';
import { Keys } from './Keys';
import { useKeyInput } from './useKeyinput';

const CreateBall = (
  ballDto: BallDto,
  canvasWidth: number,
  canvasHeight: number,
): Ball => {
  return {
    x: ballDto.x * canvasWidth,
    y: ballDto.y * canvasHeight,
    radius: 10,
  };
};

const CreatePaddle = (
  paddleDto: PaddleDto,
  canvasWidth: number,
  canvasHeight: number,
): Paddle => {
  return {
    x: paddleDto.x * canvasWidth,
    y: paddleDto.y * canvasHeight,
    width: paddleDto.width * canvasWidth,
    height: paddleDto.height * canvasHeight,
  };
};

const CreateGameObjects = (
  gameDto: GameDto,
  canvasWidth: number,
  canvasHeight: number,
): GameObjects => {
  const ball = CreateBall(gameDto.ball, canvasWidth, canvasHeight);

  const leftPaddle = CreatePaddle(
    gameDto.leftPaddle,
    canvasWidth,
    canvasHeight,
  );

  const rightPaddle = CreatePaddle(
    gameDto.rightPaddle,
    canvasWidth,
    canvasHeight,
  );

  return {
    ball,
    leftPaddle,
    rightPaddle,
    scores: gameDto.scores,
  };
};

const DrawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
};

const DrawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
};

const DrawScores = (
  ctx: CanvasRenderingContext2D,
  scores: { left: number; right: number },
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.font = '48px serif'; // TODO ピクセル数動的に変わるべきかも
  ctx.fillText(`${scores.left}`, canvasWidth / 4, canvasHeight / 4);
  ctx.fillText(`${scores.right}`, (canvasWidth * 3) / 4, canvasHeight / 4);
};

const DrawCenterLine = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = canvasWidth / 100;
  ctx.setLineDash([canvasHeight / 10, canvasHeight / 20]);
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.stroke();
};

const StyledCanvas = styled.canvas`
  border: 4px solid;
  color: black;
`;

// const GameCanvas = ({ setGameOver }: { setGameOver: () => void }) => {
const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 400;
  const canvasHeight = 400;
  const canvasId = 'canvas';

  useSocket('game data', (gameDto: GameDto) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    const game = CreateGameObjects(gameDto, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawCenterLine(ctx, canvas.width, canvas.height);
    DrawScores(ctx, game.scores, canvas.width, canvas.height);
    DrawBall(ctx, game.ball);
    DrawPaddle(ctx, game.rightPaddle);
    DrawPaddle(ctx, game.leftPaddle);
  });

  return (
    <StyledCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      id={canvasId}
    ></StyledCanvas>
  );
};

export const Game = () => {
  // const [isGameOver, setGameOver] = useState(false);

  const keyInputs: boolean[] = [];

  // [1] Edge (16 and earlier) and Firefox (36 and earlier) use "Left", "Right", "Up", and "Down" instead of "ArrowLeft", "ArrowRight", "ArrowUp", and "ArrowDown".
  const keyPressHandler = (e: KeyboardEvent) => {
    if (!keyInputs[Keys.Up] && (e.key === 'Up' || e.key === 'ArrowUp')) {
      console.log('press u');
      keyInputs[Keys.Up] = true;
      socket.emit('key press', Keys.Up);
    } else if (
      !keyInputs[Keys.Down] &&
      (e.key === 'Down' || e.key === 'ArrowDown')
    ) {
      console.log('press d');
      keyInputs[Keys.Down] = true;
      socket.emit('key press', Keys.Down);
    }
  };

  const keyReleaseHandler = (e: KeyboardEvent) => {
    if (keyInputs[Keys.Up] && (e.key === 'Up' || e.key === 'ArrowUp')) {
      console.log('release u');
      keyInputs[Keys.Up] = false;
      socket.emit('key release', Keys.Up);
    } else if (
      keyInputs[Keys.Down] &&
      (e.key === 'Down' || e.key === 'ArrowDown')
    ) {
      console.log('release d');
      keyInputs[Keys.Down] = false;
      socket.emit('key release', Keys.Down);
    }
  };

  useKeyInput(keyPressHandler, keyReleaseHandler);

  useEffect(() => {
    socket.emit('start game');
    return () => {
      socket.emit('end game');
    };
  }, []);

  return (
    // TODO : 本来はいらない気がする、とりあえず適当にUI用
    <Container>
      <GameCanvas />
    </Container>
    // <>
    //   {isGameOver && <h1>GameOver</h1>}
    //   {!isGameOver && <GameCanvas setGameOver={() => setGameOver(true)} />}
    // </>
  );
};
