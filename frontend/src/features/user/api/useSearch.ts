
import { useSessionAxios } from '../../../hooks/useSessionAxios';
import { useState } from 'react';

export const useSearch = <T>() => {
  const [searchedList, setSearchList] = useState<T[]>([]);
  const axios = useSessionAxios();

  const searcher = (path: string, searchWord: string) => {
    if (searchWord.length === 0) {
      setSearchList([]);
      return;
    }
    axios
      .get<T[]>(path + searchWord)
      .then((res) => {
        setSearchList(res.data);
      })
      // TODO とりあえず何もしない エラー表示とか出したいね
      .catch((err) => console.log(err));
  };

  return {searchedList, searcher};
};
