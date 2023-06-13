import { Paddle } from './Types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyAction = (...param: any) => void;

export enum Keys {
  Up = 0,
  Down = 1,
}

export const keyActions: KeyAction[] = [];

keyActions[Keys.Up] = (paddle: Paddle) => {
  paddle.y = Math.max(paddle.y - 5, 0);
};

keyActions[Keys.Down] = (paddle: Paddle, maxHeight: number) => {
  paddle.y = Math.min(paddle.y + 5, maxHeight - paddle.height);
};
