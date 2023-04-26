import axios from 'axios';

import { LoginDto } from '../types/UserDto';

export const userLogin = async (
  email: string,
  passwd: string,
) => {
  const url = 'http://localhost:8000/user/login';

  const loginDto: LoginDto = { email: email, hashedPassword: passwd };
  console.log('post');
  axios
    .post(url, loginDto)
    .then((res) => {
      console.log('login res:', res);
    })
    .catch((err) => {
      console.log('login err:', err);
    });
};

