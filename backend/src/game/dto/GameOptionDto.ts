import { UserInfo } from './UserDto';

export type GameOptionDto = {
  ballSpeed: number;
  matchpoint: number;
};

export type UserGameOption = {
  user: UserInfo;
  opt: GameOptionDto;
};
