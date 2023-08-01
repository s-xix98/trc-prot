import { Ball, GameObjects, Paddle } from './Types';
import { BallDto, GameDto, PaddleDto } from './dto/GameDto';

export const CreateGameObjects = (
  gameDto: GameDto,
  scale: number,
): GameObjects => {
  const ball = CreateBall(gameDto.ball, scale);

  const leftPaddle = CreatePaddle(gameDto.leftPaddle, scale);

  const rightPaddle = CreatePaddle(gameDto.rightPaddle, scale);

  return {
    ball,
    leftPaddle,
    rightPaddle,
    scores: gameDto.scores,
  };
};

const CreateBall = (ballDto: BallDto, scale: number): Ball => {
  return {
    x: ballDto.x * scale,
    y: ballDto.y * scale,
    radius: 10,
  };
};

const CreatePaddle = (paddleDto: PaddleDto, scale: number): Paddle => {
  return {
    x: paddleDto.x * scale,
    y: paddleDto.y * scale,
    width: paddleDto.width * scale,
    height: paddleDto.height * scale,
  };
};
