import { Paddle } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyAction = (...param: any) => void;

export enum Keys {
  Up = 0,
  Down = 1,
}

export const keyActions: KeyAction[] = [];

keyActions[Keys.Up] = (paddle: Paddle) => {
  paddle.y = Math.max(paddle.y - paddle.speed, 0);
};

keyActions[Keys.Down] = (paddle: Paddle) => {
  paddle.y = Math.min(paddle.y + paddle.speed, 1 - paddle.height);
};
