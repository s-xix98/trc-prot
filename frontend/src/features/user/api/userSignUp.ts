import axios from 'axios';
import { useSetAtom } from 'jotai';

import { accessToken } from '@/app/login/types/accessToken';
import { tokenStorage } from '@/utils/tokenStorage';
import { userInfoAtom } from '@/stores/jotai';

import { SignUpDto } from '../types/UserDto';
import { UserInfo } from '../types/UserDto';

import { BACKEND } from '../../../constants';
import { useSessionAxios } from '../../../hooks/useSessionAxios';

export const useSignUp = () => {
  const setUserInfo = useSetAtom(userInfoAtom);
  const sessionAxios = useSessionAxios();

  const signUp = async (username: string, email: string, pass: string) => {
    const loginDto: SignUpDto = {
      username: username,
      email: email,
      hashedPassword: pass,
    };

    try {
      const res = await axios.post<accessToken>(
        BACKEND + '/auth/signup',
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

  return signUp;
};
