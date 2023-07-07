export type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

export type Paddle = {
  readonly x: number;
  y: number;
  readonly width: number;
  readonly height: number;
  readonly speed: number;
};

export type Scores = { left: number; right: number };
