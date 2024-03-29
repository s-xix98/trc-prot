import { UserInfo } from './UserDto';

export type MatchHistory = {
  player1: UserInfo;
  player2: UserInfo;
  winner: UserInfo | null;
  p1Score: number;
  p2Score: number;
  createdAt: Date;
};

export type Rate = {
  userData: UserInfo;
  rating: number;
};
