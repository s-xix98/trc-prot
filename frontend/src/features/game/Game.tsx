'use client';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useSocket } from '@/hooks/useSocket';
import { Container } from '@/components/Layout/Container';
import { useSafeEmit } from '@/hooks/useSafeEmit';

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
  ctx.fillStyle = 'white';
  ctx.font = '48px serif'; // TODO ピクセル数動的に変わるべきかも
  const leftWidth = ctx.measureText(`${scores.left}`).width;
  const rightWidth = ctx.measureText(`${scores.right}`).width;
  ctx.fillText(
    `${scores.left}`,
    canvasWidth / 4 - leftWidth / 2,
    canvasHeight / 4,
  );
  ctx.fillText(
    `${scores.right}`,
    (canvasWidth * 3) / 4 - rightWidth / 2,
    canvasHeight / 4,
  );
};

const DrawResult = (
  ctx: CanvasRenderingContext2D,
  result: 'WIN' | 'LOSE',
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.fillStyle = 'white';
  ctx.font = '48px serif'; // TODO ピクセル数動的に変わるべきかも
  const mesure = ctx.measureText(result);
  const width = mesure.width;
  const height =
    mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent;
  ctx.fillText(
    result,
    (canvasWidth - width) / 2,
    canvasHeight / 2 + height / 2,
  );
};

const DrawPlayerSide = (
  ctx: CanvasRenderingContext2D,
  side: 'LEFT' | 'RIGHT',
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.fillStyle = 'white';
  ctx.font = '30px serif'; // TODO ピクセル数動的に変わるべきかも
  const mesure = ctx.measureText('YOU →');
  const width = mesure.width;
  const height =
    mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent;
  if (side == 'LEFT') {
    ctx.fillText(
      '← YOU',
      canvasWidth / 4 - width / 2,
      canvasHeight / 2 + height / 2,
    );
  } else {
    ctx.fillText(
      'YOU →',
      (canvasWidth * 3) / 4 - width / 2,
      canvasHeight / 2 + height / 2,
    );
  }
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

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 400;
  const canvasHeight = 400;
  const canvasId = 'canvas';

  const ReadyGame = (gameDto: GameDto, side: 'LEFT' | 'RIGHT') => {
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

  useSocket('game ready left', (gameDto: GameDto) => {
    ReadyGame(gameDto, 'LEFT');
  });

  useSocket('game ready right', (gameDto: GameDto) => {
    ReadyGame(gameDto, 'RIGHT');
  });

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

  // TODO refactor するかわかんないけど
  useSocket('game win', (gameDto: GameDto) => {
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
    DrawResult(ctx, 'WIN', canvas.width, canvas.height);
  });

  useSocket('game lose', (gameDto: GameDto) => {
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
    DrawResult(ctx, 'LOSE', canvas.width, canvas.height);
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
  const emit = useSafeEmit();
  const keyInputs: boolean[] = [];

  // [1] Edge (16 and earlier) and Firefox (36 and earlier) use "Left", "Right", "Up", and "Down" instead of "ArrowLeft", "ArrowRight", "ArrowUp", and "ArrowDown".
  const keyPressHandler = (e: KeyboardEvent) => {
    if (!keyInputs[Keys.Up] && (e.key === 'Up' || e.key === 'ArrowUp')) {
      console.log('press u');
      keyInputs[Keys.Up] = true;
      emit('key press', Keys.Up);
    } else if (
      !keyInputs[Keys.Down] &&
      (e.key === 'Down' || e.key === 'ArrowDown')
    ) {
      console.log('press d');
      keyInputs[Keys.Down] = true;
      emit('key press', Keys.Down);
    }
  };

  const keyReleaseHandler = (e: KeyboardEvent) => {
    if (keyInputs[Keys.Up] && (e.key === 'Up' || e.key === 'ArrowUp')) {
      console.log('release u');
      keyInputs[Keys.Up] = false;
      emit('key release', Keys.Up);
    } else if (
      keyInputs[Keys.Down] &&
      (e.key === 'Down' || e.key === 'ArrowDown')
    ) {
      console.log('release d');
      keyInputs[Keys.Down] = false;
      emit('key release', Keys.Down);
    }
  };

  useKeyInput(keyPressHandler, keyReleaseHandler);

  useEffect(() => {
    emit('start game');
  }, [emit]);

  return (
    // TODO : 本来はいらない気がする、とりあえず適当にUI用
    <Container>
      <GameCanvas />
    </Container>
  );
};
