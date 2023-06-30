import { useEffect, useState } from 'react';

import { useSessionAxios } from '@/hooks/useSessionAxios';

import { UserInfo } from '../types/UserDto';

export const useGetFriends = () => {
  const sessionAxios = useSessionAxios();
  const [friends, setFriends] = useState<UserInfo[]>([]);

  useEffect(() => {
    sessionAxios
      .get<UserInfo[]>('/user/friends')
      .then((res) => {
        setFriends(() => res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sessionAxios]);

  return { friends };
};
