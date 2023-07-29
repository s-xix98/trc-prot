import { Ball, Paddle } from './types';

export const canvas = {
  xMin: 0,
  xMax: 1,
  yMin: 0,
  yMax: 1,
} as const;

export const CreateBall = (): Ball => structuredClone(ballConstants);

export const CreateLeftPaddle = () => {
  return CreatePaddle(canvas.xMin);
};

export const CreateRightPaddle = () => {
  return CreatePaddle(canvas.xMax - paddleConstants.width);
};

const CreatePaddle = (x: number): Paddle => {
  return {
    x: x,
    y: canvas.yMax / 2 - paddleConstants.height / 2,
    height: paddleConstants.height,
    width: paddleConstants.width,
    speed: paddleConstants.speed,
  };
};

const ballConstants = {
  x: canvas.xMax / 2,
  y: canvas.yMax / 2,
  speed: 0.005,
  angle: 0,
} as const;

const paddleConstants = {
  height: 0.25,
  width: 0.025,
  speed: 0.02,
} as const;
