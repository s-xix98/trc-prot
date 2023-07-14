'use client';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Container } from '@/components/Layout/Container';
import { useSessionSocketEmitter, useSessionSocket } from '@/hooks/useSocket';

import { GameDto } from './dto/GameDto';
import { Keys } from './Keys';
import { useKeyInput } from './useKeyinput';
import { CreateGameObjects } from './Factory';
import {
  DrawBall,
  DrawCenterLine,
  DrawPaddle,
  DrawPlayerSide,
  DrawResult,
  DrawScores,
} from './Draw';

const StyledCanvas = styled.canvas`
  border: 4px solid;
  color: black;
`;

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 400;
  const canvasHeight = 400;
  const canvasId = 'canvas';

  const DrawGameWithPlayerSide = (gameDto: GameDto, side: 'LEFT' | 'RIGHT') => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    const game = CreateGameObjects(gameDto, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawCenterLine(ctx, canvas.width, canvas.height);
    DrawScores(ctx, game.scores, canvas.width, canvas.height);
    DrawPaddle(ctx, game.rightPaddle);
    DrawPaddle(ctx, game.leftPaddle);
    DrawPlayerSide(ctx, side, canvas.width, canvas.height);
  };

  const DrawGameResult = (gameDto: GameDto, result: 'WIN' | 'LOSE') => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    const game = CreateGameObjects(gameDto, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawCenterLine(ctx, canvas.width, canvas.height);
    DrawScores(ctx, game.scores, canvas.width, canvas.height);
    DrawPaddle(ctx, game.rightPaddle);
    DrawPaddle(ctx, game.leftPaddle);
    DrawResult(ctx, result, canvas.width, canvas.height);
  };

  useSessionSocket('game ready left', (gameDto: GameDto) => {
    DrawGameWithPlayerSide(gameDto, 'LEFT');
  });

  useSessionSocket('game ready right', (gameDto: GameDto) => {
    DrawGameWithPlayerSide(gameDto, 'RIGHT');
  });

  useSessionSocket('game win', (gameDto: GameDto) => {
    DrawGameResult(gameDto, 'WIN');
  });

  useSessionSocket('game lose', (gameDto: GameDto) => {
    DrawGameResult(gameDto, 'LOSE');
  });

  useSessionSocket('game data', (gameDto: GameDto) => {
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
  const keyInputs: boolean[] = [];

  const sessionSocketEmitter = useSessionSocketEmitter();

  // [1] Edge (16 and earlier) and Firefox (36 and earlier) use "Left", "Right", "Up", and "Down" instead of "ArrowLeft", "ArrowRight", "ArrowUp", and "ArrowDown".
  const keyPressHandler = (e: KeyboardEvent) => {
    if (!keyInputs[Keys.Up] && (e.key === 'Up' || e.key === 'ArrowUp')) {
      console.log('press u');
      keyInputs[Keys.Up] = true;
      sessionSocketEmitter.emit('key press', Keys.Up);
    } else if (
      !keyInputs[Keys.Down] &&
      (e.key === 'Down' || e.key === 'ArrowDown')
    ) {
      console.log('press d');
      keyInputs[Keys.Down] = true;
      sessionSocketEmitter.emit('key press', Keys.Down);
    }
  };

  const keyReleaseHandler = (e: KeyboardEvent) => {
    if (keyInputs[Keys.Up] && (e.key === 'Up' || e.key === 'ArrowUp')) {
      console.log('release u');
      keyInputs[Keys.Up] = false;
      sessionSocketEmitter.emit('key release', Keys.Up);
    } else if (
      keyInputs[Keys.Down] &&
      (e.key === 'Down' || e.key === 'ArrowDown')
    ) {
      console.log('release d');
      keyInputs[Keys.Down] = false;
      sessionSocketEmitter.emit('key release', Keys.Down);
    }
  };

  useKeyInput(keyPressHandler, keyReleaseHandler);

  useEffect(() => {
    sessionSocketEmitter.emit('start game');
  }, [sessionSocketEmitter]);

  return (
    // TODO : 本来はいらない気がする、とりあえず適当にUI用
    <Container>
      <GameCanvas />
    </Container>
  );
};
