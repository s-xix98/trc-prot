import { useCallback, useEffect, useState } from 'react';

import { useCustomAxiosGetter } from '@/hooks/useSessionAxios';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { MatchHistoryArrDto } from '../types/matchHistoryDto';
import { MatchHistoryArrDtoSchema } from '../types/matchHistoryDto';

export const useMatchHistory = () => {
  const [matchHistories, setMatchHistories] = useState<MatchHistoryArrDto>([]);
  const { currentUserInfo } = useCurrentUser();
  const { customAxiosGetter } = useCustomAxiosGetter();

  const onSucessCallback = useCallback((r: MatchHistoryArrDto) => {
    setMatchHistories(r);
    console.log('matchHistories', r);
  }, []);

  useEffect(() => {
    customAxiosGetter(
      {
        uri: '/game/match-history',
        params: { params: { userId: currentUserInfo?.id } },
      },
      MatchHistoryArrDtoSchema,
      onSucessCallback,
    );
  }, [customAxiosGetter, onSucessCallback, currentUserInfo?.id]);

  return { matchHistories };
};
