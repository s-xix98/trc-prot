import { Ball, Paddle } from './types.d';

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
};

const paddleConstants = {
  height: 0.25,
  width: 0.025,
  speed: 0.1,
};
