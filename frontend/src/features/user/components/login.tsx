import { FormEventHandler } from 'react';

export const Login = () => {
  const handleLogin: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log('loginButton');
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    console.log(email, password);
  };

  return (
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
  );
};

