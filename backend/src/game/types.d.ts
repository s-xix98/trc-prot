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
  scores: Scores,
) => void;

export type Rate = {
  userId: string;
  username: string;
  rating: number;
};

export type PlayerData = { client: Socket; data: UserInfo };
