import axios from 'axios';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

import { tokenStorage } from '@/utils/tokenStorage';
import { accessToken } from '@/app/login/types/accessToken';
import { socketAtom, userInfoAtom } from '@/stores/jotai';

import { LoginDto, UserInfo } from '../types/UserDto';

import { useSessionAxios } from '../../../hooks/useSessionAxios';
import { BACKEND } from '../../../constants';

export const useLogin = () => {
  const setUserInfo = useSetAtom(userInfoAtom);
  const sessionAxios = useSessionAxios();
  const setSocket = useSetAtom(socketAtom);

  const automaticLogin = () => {
    sessionAxios
      .get<UserInfo>('/user/me')
      .then((res) => {
        setUserInfo(res.data);
        setSocket(io(BACKEND, { auth: { token: tokenStorage.get() } }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const manualLogin = (email: string, pass: string) => {
    const loginDto: LoginDto = { email: email, hashedPassword: pass };

    axios
      .post<accessToken>(BACKEND + '/auth/login', loginDto)
      .then((res) => {
        tokenStorage.set(res.data.jwt);
        automaticLogin();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { automaticLogin, manualLogin };
};

export const useVerifySession = () => {
  const sessionAxios = useSessionAxios();

  // sessionAxios が 401 の時に logout して /login まで 運んでくれる
  const verifySession = () => {
    sessionAxios.get<UserInfo>('/user/me').catch((err) => {
      console.log(err);
    });
  };

  return { verifySession };
};

export const useLogout = () => {
  const router = useRouter();
  const [socket, setSocket] = useAtom(socketAtom);
  const [, setUserInfo] = useAtom(userInfoAtom);

  const logout = () => {
    socket?.disconnect();
    setUserInfo(undefined);
    setSocket(undefined);
    tokenStorage.remove();
    router.push('/login');
  };

  return { logout };
};
