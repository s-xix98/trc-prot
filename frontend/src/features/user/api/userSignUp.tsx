import axios, { AxiosResponse } from 'axios';

import { SignUpDto, UserInfo } from '../types/UserDto';

export const userSignUp = async (
  nickname: string,
  email: string,
  passwd: string,
  setUserInfo: (v: UserInfo) => void,
) => {
  console.log('post /user/signup');
  const url = 'http://localhost:8000/user/signup';

  // TODO validation フロントとバックどっちの責任？
  const signUpDto: SignUpDto = {
    nickname: nickname,
    email: email,
    hashedPassword: passwd,
  };

  // postでブロックしても問題ないならasync awaitでもいいかも
  axios
    .post<UserInfo>(url, signUpDto)
    .then((res: AxiosResponse<UserInfo>) => {
      console.log('signup res:', res);
      setUserInfo(res.data);
    })
    .catch((err) => {
      // TODO とりあえずなにもしない
      console.log('signup err:', err);
    });
};
