import { useEffect, useState } from 'react';

import { useSessionAxios } from '@/hooks/useSessionAxios';

import { UserInfo } from '../types/UserDto';

export const useGetBlocks = () => {
  const sessionAxios = useSessionAxios();
  const [blocks, setBlocks] = useState<UserInfo[]>([]);

  useEffect(() => {
    sessionAxios
      .get<UserInfo[]>('/user/blocks')
      .then((res) => {
        setBlocks(() => res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sessionAxios]);

  return { blocks };
};
