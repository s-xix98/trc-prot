import { Ball, Paddle, Scores } from '../Types';

export type BallDto = Omit<Ball, 'dx' | 'dy'>; // TODO lodash
export type PaddleDto = Paddle;

export type GameDto = {
  ball: BallDto;
  leftPaddle: PaddleDto;
  rightPaddle: PaddleDto;
  scores: Scores;
};
