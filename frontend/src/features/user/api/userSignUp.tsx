import { UserInfo } from '../types/UserDto';

// stub
export const userSignUp = async (
  nickname: string,
  email: string,
  passwd: string,
  setUserInfo: (v: UserInfo) => void,
) => {
  console.log('post /user/signup');
  alert(`nickname: ${nickname}\nemail: ${email}\npassword: ${passwd}`);
};
