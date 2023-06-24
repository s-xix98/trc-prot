import { Ball } from '../Types';

type BallDto = Omit<Ball, 'dx' | 'dy' | 'radius'>; // TODO lodash

export type GameDto = {
  ball: BallDto;
};
