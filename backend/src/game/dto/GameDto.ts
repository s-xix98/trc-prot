import { Ball, Paddle } from '../types';

type BallDto = Omit<Ball, 'dx' | 'dy'>; // TODO lodash
type PaddleDto = Omit<Paddle, 'speed'>;

export type GameDto = {
  ball: BallDto;
  leftPaddle: PaddleDto;
  rightPaddle: PaddleDto;
};
