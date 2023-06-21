import { FormEventHandler } from 'react';

import { useLogin } from '../api/userLogin';

export const LoginForm = () => {
  const login = useLogin();

  const handleLogin: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log('loginButton');
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    login(email, password);
  };

  // TODO : 消す
  const loginAsHuga = () => {
    login('huga@example.com', 'hugahuga');
  };
  const loginAsPiyo = () => {
    login('piyo@example.com', 'piyopiyo');
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
