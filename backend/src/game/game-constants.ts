import { Ball } from './types.d';

export const CreateBall = (): Ball => structuredClone(ballConstants);

const ballConstants = {
  x: 0.5,
  y: 0.5,
  // dx: 0.0025,
  // dy: 0.00125,
  dx: 0,
  dy: 0.025,
};
