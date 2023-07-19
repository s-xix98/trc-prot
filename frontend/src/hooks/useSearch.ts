import { z } from 'zod';
import { useCallback, useMemo, useState } from 'react';

import { useCustomAxiosGetter } from '@/hooks/useSessionAxios';

export const useSearch = <T>(schema: z.ZodSchema<T>) => {
  const [searchedList, setSearchList] = useState<T[]>([]);

  const { customAxiosGetter } = useCustomAxiosGetter();

  const schemaArr = useMemo(() => schema.array(), [schema]);

  const searcher = useCallback(
    (path: string, searchWord: string) => {
      const onSucessCallback = (resData: T[]) => {
        setSearchList(resData);
      };

      if (searchWord.length === 0) {
        setSearchList([]);
        return;
      }
      customAxiosGetter(
        { uri: path, params: { params: { searchWord } } },
        schemaArr,
        onSucessCallback,
      );
    },
    [customAxiosGetter, schemaArr],
  );

  return { searchedList, searcher };
};
