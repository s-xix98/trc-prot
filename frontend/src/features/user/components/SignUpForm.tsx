import { FormEventHandler } from 'react';

import { UserInfo } from '../types/UserDto';
import { userSignUp } from '../api/userSignUp';

export const SignUpForm = ({
  setUserInfo,
}: {
  setUserInfo: (v: UserInfo) => void;
}) => {
  const handleSignUp: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log('signUpButton');
    const username = (event.target as HTMLFormElement).username.value;
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    userSignUp(username, email, password, setUserInfo);
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="text"
        name="username"
        placeholder="username"
        style={{ marginRight: '5px' }}
      />
      <input
        type="text"
        name="email"
        placeholder="email"
        style={{ marginRight: '5px' }}
      />
      <input
        type="text"
        name="password"
        placeholder="password"
        style={{ marginRight: '10px' }}
      />
      <input type="submit" value="SignUp" />
    </form>
  );
};
