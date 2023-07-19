import { UserInfo } from './UserDto';

export type MatchHistory = {
  player1: UserInfo;
  player2: UserInfo;
  winner: UserInfo | null;
  createdAt: Date;
};
