import { Ball, Paddle } from '../Types';

type BallDto = Omit<Ball, 'dx' | 'dy'>; // TODO lodash
type PaddleDto = Paddle;

export type GameDto = {
  ball: BallDto;
  leftPaddle: PaddleDto;
  rightPaddle: PaddleDto;
};
