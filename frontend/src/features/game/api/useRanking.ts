import { useCallback, useEffect, useState } from 'react';

import { useCustomAxiosGetter } from '@/hooks/useSessionAxios';

import { RateArr } from '../types/rankingDto';
import { RateArrDtoSchema } from '../types/rankingDto';

export const useRanking = () => {
  const [ranking, setRanking] = useState<RateArr>([]);

  const { customAxiosGetter } = useCustomAxiosGetter();

  const onSucessCallback = useCallback((rankingArr: RateArr) => {
    setRanking(rankingArr);
  }, []);

  useEffect(() => {
    customAxiosGetter(
      { uri: '/game/ranking' },
      RateArrDtoSchema,
      onSucessCallback,
    );
  }, [customAxiosGetter, onSucessCallback]);

  return { ranking };
};
