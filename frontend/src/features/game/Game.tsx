'use client';
// import { useEffect, useRef, useState } from 'react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { socket } from '@/socket';
import { useSocket } from '@/hooks/useSocket';

import { Ball } from './Types';
import { GameDto } from './dto/GameDto';

const DrawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
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
    console.log('game start');
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ball: Ball = {
      x: game.ball.x * canvasWidth,
      y: game.ball.y * canvasHeight,
      radius: 10,
    };
    console.log(ball);
    DrawBall(ctx, ball);
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
