import { Ball, GameObjects, Paddle } from './Types';
import { BallDto, GameDto, PaddleDto } from './dto/GameDto';

export const CreateGameObjects = (
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
