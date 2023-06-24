import { Ball } from '../types';

type BallDto = Omit<Ball, 'dx' | 'dy'>; // TODO lodash

export type GameDto = {
  ball: BallDto;
};
