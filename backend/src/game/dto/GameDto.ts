import { Ball, Paddle, Scores } from '../types';

type BallDto = Omit<Ball, 'speed' | 'angle'>; // TODO lodash
type PaddleDto = Omit<Paddle, 'speed'>;

export type GameDto = {
  ball: BallDto;
  leftPaddle: PaddleDto;
  rightPaddle: PaddleDto;
  scores: Scores;
};
