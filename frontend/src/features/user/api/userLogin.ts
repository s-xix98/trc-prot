import axios from 'axios';
import { useSetAtom } from 'jotai';

import { tokenStorage } from '@/utils/tokenStorage';
import { accessToken } from '@/app/login/types/accessToken';
import { userInfoAtom } from '@/stores/jotai';

import { LoginDto, UserInfo } from '../types/UserDto';

import { useSessionAxios } from '../../../hooks/useSessionAxios';
import { BACKEND } from '../../../constants';

export const useLogin = () => {
  const setUserInfo = useSetAtom(userInfoAtom);
  const sessionAxios = useSessionAxios();

  const login = async (email: string, pass: string) => {
    const loginDto: LoginDto = { email: email, hashedPassword: pass };

    try {
      const res = await axios.post<accessToken>(
        BACKEND + '/auth/login',
        loginDto,
      );
      tokenStorage.set(res.data.jwt);

      const user = await sessionAxios.get<UserInfo>('/user/me');
      setUserInfo(user.data);
      // TODO とりあえずlogだけ
    } catch (err) {
      console.log(err);
    }
  };

  return login;
};
