import axios from 'axios';
import { useSnackbar } from 'notistack';
import { z } from 'zod';

import { accessToken } from '@/app/login/types/accessToken';
import { tokenStorage } from '@/utils/tokenStorage';

import { SignUpDto } from '../types/UserDto';

import { useLogin } from './userLogin';

import { BACKEND } from '../../../constants';

export const useSignUp = () => {
  const { automaticLogin } = useLogin();
  const { enqueueSnackbar } = useSnackbar();

  const signUp = (username: string, email: string, pass: string) => {
    const signUpDto: SignUpDto = {
      username: username,
      email: email,
      hashedPassword: pass,
    };

    axios
      .post<accessToken>(BACKEND + '/auth/signup', signUpDto)
      .then((res) => {
        tokenStorage.set(res.data.jwt);
        automaticLogin();
      })
      .catch((err) => {
        // TODO とりあえずlogだけ
        console.log(err);
        const resErrMsg = z.string().safeParse(err?.response?.data?.message);
        enqueueSnackbar(resErrMsg.success ? resErrMsg.data : 'SignUp Error');
      });
  };

  return { signUp };
};
