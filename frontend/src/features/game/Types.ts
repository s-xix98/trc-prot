export type Ball = {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
};

export type Paddle = {
  readonly x: number;
  y: number;
  width: number;
  height: number;
  readonly speed: number;
};
