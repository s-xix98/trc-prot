import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { tokenStorage } from '@/utils/tokenStorage';
import { BACKEND } from '@/constants';
import { userInfoAtom } from '@/stores/jotai';

import { UserInfo } from '../types/UserDto';

export const useAuthLogin = () => {
  const axios = useSessionAxios();
  const setUserInfo = useSetAtom(userInfoAtom);

  useEffect(() => {
    const queryParam = new URLSearchParams(window.location.search);
    const token = queryParam.get('access_token');

    if (!token) {
      return;
    }

    tokenStorage.set(token);

    axios
      .get<UserInfo>('/user/me')
      .then((res) => {
        console.log(res.data);
        setUserInfo(res.data);
        // TODO とりあえずlogだけ
      })
      .catch((err) => {
        console.log(err);
      });
  }, [axios, setUserInfo]);

  const login = (path: string) => {
    window.location.href = BACKEND + path;
  };

  return login;
};
