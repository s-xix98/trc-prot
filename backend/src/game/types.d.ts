import { Socket } from 'socket.io';

import { UserInfo } from './dto/UserDto';

export type Ball = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number;
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
  player1: PlayerResult,
  player2: PlayerResult,
  resultEvaluator: ResultEvaluator,
) => Promise<void>;

export type PlayerData = { client: Socket; data: UserInfo };

export type PlayerResult = {
  readonly userId: string;
  readonly score: number;
};

export type ResultEvaluator = (
  p1: PlayerResult,
  p2: PlayerResult,
) => { winner: PlayerResult; loser: PlayerResult } | null;
