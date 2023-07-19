import { useEffect } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionAxios } from '@/hooks/useSessionAxios';

import { UserInfo } from '../types/UserDto';

export type MatchHistory = {
  player1: UserInfo;
  player2: UserInfo;
  winner: UserInfo | null;
  createdAt: Date;
};

export type Rate = {
  userData: UserInfo;
  rating: number;
};

export const History = () => {
  const sessionAxios = useSessionAxios();
  const { currentUserInfo } = useCurrentUser();

  useEffect(() => {
    sessionAxios
      .get<MatchHistory[]>('/game/match-history', {
        params: {
          userId: currentUserInfo?.id,
        },
      })
      .then((res) => {
        console.log('match-history', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sessionAxios, currentUserInfo]);
  return <></>;
};

export const Ranking = () => {
  const sessionAxios = useSessionAxios();
  useEffect(() => {
    sessionAxios
      .get<Rate[]>('/game/ranking')
      .then((res) => {
        console.log('ranking', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sessionAxios]);
  return <></>;
};
