export type Ball = {
  x: number;
  y: number;
  radius: number;
};

export type Paddle = {
  readonly x: number;
  y: number;
  width: number;
  height: number;
};

export type GameObjects = {
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
};
