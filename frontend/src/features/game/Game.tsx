'use client';
// import { useEffect, useRef, useState } from 'react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { socket } from '@/socket';
import { useSocket } from '@/hooks/useSocket';

import { Ball, Paddle } from './Types';
import { BallDto, GameDto, PaddleDto } from './dto/GameDto';

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

  useSocket('game data', (game: GameDto) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    const ball = CreateBall(game.ball, canvasWidth, canvasHeight);
    const leftPaddle = CreatePaddle(game.leftPaddle, canvasWidth, canvasHeight);
    const rightPaddle = CreatePaddle(
      game.rightPaddle,
      canvasWidth,
      canvasHeight,
    );
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawBall(ctx, ball);
    DrawPaddle(ctx, rightPaddle);
    DrawPaddle(ctx, leftPaddle);
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

  useEffect(() => {
    socket.emit('start game');
    return () => {
      socket.emit('end game');
    };
  }, []);

  return (
    <GameCanvas />
    // <>
    //   {isGameOver && <h1>GameOver</h1>}
    //   {!isGameOver && <GameCanvas setGameOver={() => setGameOver(true)} />}
    // </>
  );
};
