import { Ball } from '../Types';

type BallDto = Omit<Ball, 'dx' | 'dy'>; // TODO lodash
type PaddleDto = Paddle;

export type GameDto = {
  ball: BallDto;
};
