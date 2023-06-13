import axios, { AxiosResponse } from 'axios';

import { LoginDto, UserInfo } from '../types/UserDto';

import { BACKEND } from '../../../constants';

export const userLogin = async (
  email: string,
  passwd: string,
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | undefined>>,
) => {
  console.log('post');
  const url = BACKEND + '/auth/login';
  const loginDto: LoginDto = { email: email, hashedPassword: passwd };

  // postでブロックしても問題ないならasync awaitでもいいかも
  axios
    .post<UserInfo>(url, loginDto)
    .then((res: AxiosResponse<UserInfo>) => {
      console.log('login res:', res);
      setUserInfo(res.data);
    })
    .catch((err) => {
      // TODO とりあえずなにもしない
      console.log('login err:', err);
    });
};
