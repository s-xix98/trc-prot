import { FormEventHandler } from 'react';

import { userLogin } from '../api/userLogin';
import { UserInfo } from '../types/UserDto';

export const LoginForm = ({
  setUserInfo,
}: {
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | undefined>>;
}) => {
  const handleLogin: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log('loginButton');
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    userLogin(email, password, setUserInfo);
  };

  // TODO : 消す
  const loginAsHuga = () => {
    userLogin('huga@example.com', 'hugahuga', setUserInfo);
  };
  const loginAsPiyo = () => {
    userLogin('piyo@example.com', 'piyopiyo', setUserInfo);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
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
        <input type="submit" value="Login" />
      </form>
      <div style={{ padding: '3px' }}>
        <button onClick={loginAsHuga}>login as fuga</button>
        <button onClick={loginAsPiyo}>login as piyo</button>
      </div>
    </>
  );
};
