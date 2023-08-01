import axios from 'axios';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { z } from 'zod';

import { tokenStorage } from '@/utils/tokenStorage';
import { accessToken } from '@/app/login/types/accessToken';
import { currentUserAtom, socketAtom } from '@/stores/jotai';

import { LoginDto, UserInfo, UserInfoSchema } from '../types/UserDto';

import {
  useCustomAxiosGetter,
  useSessionAxios,
} from '../../../hooks/useSessionAxios';
import { BACKEND } from '../../../constants';

export const useLogin = () => {
  const setCurrentUser = useSetAtom(currentUserAtom);
  const { customAxiosGetter } = useCustomAxiosGetter();
  const setSocket = useSetAtom(socketAtom);
  const { enqueueSnackbar } = useSnackbar();

  const automaticLogin = useCallback(() => {
    const onSucessCallback = (userInfo: UserInfo) => {
      setCurrentUser({
        userInfo: userInfo,
        friends: [],
        friendRequests: [],
        blockUsers: [],
        joinedRooms: [],
        receiveInviteChatRooms: [],
      });
      setSocket(io(BACKEND, { auth: { token: tokenStorage.get() } }));
    };

    customAxiosGetter({ uri: '/user/me' }, UserInfoSchema, onSucessCallback);
  }, [customAxiosGetter, setCurrentUser, setSocket]);

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
        const resErrMsg = z.string().safeParse(err?.response?.data?.message);
        enqueueSnackbar(resErrMsg.success ? resErrMsg.data : 'Login Error');
      });
  };

  return { automaticLogin, manualLogin };
};

export const useVerifySession = () => {
  const sessionAxios = useSessionAxios();
  const { enqueueSnackbar } = useSnackbar();

  // sessionAxios が 401 の時に logout して /login まで 運んでくれる
  const verifySession = () => {
    sessionAxios.get<UserInfo>('/user/me').catch((err) => {
      console.log(err);
      const resErrMsg = z.string().safeParse(err?.response?.data?.message);
      enqueueSnackbar(resErrMsg.success ? resErrMsg.data : 'Session Error');
    });
  };

  return { verifySession };
};

export const useLogout = () => {
  const router = useRouter();
  const [socket, setSocket] = useAtom(socketAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);

  const logout = () => {
    socket?.disconnect();
    setCurrentUser(undefined);
    setSocket(undefined);
    tokenStorage.remove();
    router.push('/login');
  };

  return { logout };
};
