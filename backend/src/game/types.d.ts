import { Socket } from 'socket.io';

import { UserInfo } from './dto/UserDto';

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

export type OnShutdownCallback = (
  winnerUserId: string,
  loserUserId: string,
  player1UserId: string,
  player2UserId: string,
  player1score: number,
  player2score: number,
) => void;

export type Rate = {
  userId: string;
  username: string;
  rating: number;
};

export type PlayerData = { client: Socket; data: UserInfo };

export type PlayerResult = {
  readonly userId: string;
  readonly score: number;
};

export type ResultEvaluator = (
  p1: PlayerResult,
  p2: PlayerResult,
) => { winner: PlayerResult; loser: PlayerResult } | null;
