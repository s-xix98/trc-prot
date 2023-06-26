import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { BACKEND } from '@/constants';
import { userInfoAtom } from '@/stores/jotai';

import { UserInfo } from '../features/user/types/UserDto';

export const useSession = () => {
  const axios = useSessionAxios();
  const setUserInfo = useSetAtom(userInfoAtom);
  const pathname = usePathname();

  useEffect(() => {
    axios
      .get<UserInfo>(BACKEND + '/user/me')
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [axios, setUserInfo, pathname]);
};
