import { useCallback, useEffect, useState } from 'react';

import { useCustomAxiosGetter } from '@/hooks/useSessionAxios';
import { UserInfo } from '@/features/user/types/UserDto';

import { MatchHistoryArrDto } from '../types/matchHistoryDto';
import { MatchHistoryArrDtoSchema } from '../types/matchHistoryDto';

export const useMatchHistory = (userInfo: UserInfo) => {
  const [matchHistories, setMatchHistories] = useState<MatchHistoryArrDto>([]);
  const { customAxiosGetter } = useCustomAxiosGetter();

  const onSucessCallback = useCallback((r: MatchHistoryArrDto) => {
    setMatchHistories(r);
    console.log('matchHistories', r);
  }, []);

  useEffect(() => {
    customAxiosGetter(
      {
        uri: '/game/match-history',
        params: { params: { userId: userInfo.id } },
      },
      MatchHistoryArrDtoSchema,
      onSucessCallback,
    );
  }, [customAxiosGetter, onSucessCallback, userInfo.id]);

  return { matchHistories };
};
