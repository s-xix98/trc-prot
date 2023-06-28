import { Ball, Paddle } from './types';

export const canvas = {
  xMin: 0,
  xMax: 1,
  yMin: 0,
  yMax: 1,
} as const;

export const CreateBall = (): Ball => structuredClone(ballConstants);

export const CreatePaddle = (x: number): Paddle => {
  return {
    x: x >= 1 - paddleConstants.width ? 1 - paddleConstants.width : x,
    y: 0.5 - paddleConstants.height / 2,
    height: paddleConstants.height,
    width: paddleConstants.width,
    speed: paddleConstants.speed,
  };
};

const ballConstants = {
  x: 0.5,
  y: 0.5,
  dx: 0.0025,
  dy: 0.00125,
} as const;

const paddleConstants = {
  height: 0.25,
  width: 0.025,
  speed: 0.02,
} as const;
