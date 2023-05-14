import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { signIn } from 'next-auth/react';

import { Container } from '@/components/Layout/Container';
import { userInfoAtom } from '@/App';

import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export const User = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  const UserInputArea = () => {
    if (userInfo) {
      return (
        <p>
          id : {userInfo?.id}, name : {userInfo?.nickname}
        </p>
      );
    } else {
      return (
        <div style={{ margin: '10px auto 10px auto' }}>
          <SignUpForm setUserInfo={(v) => setUserInfo(v)} />
          <div style={{ margin: '5px 10px auto auto', textAlign: 'right' }}>
            <LoginForm setUserInfo={(v) => setUserInfo(v)} />
          </div>
        </div>
      );
    }
  };
  const AuthLoginButton = () => {
    return <button onClick={() => signIn()}>authlogin</button>;
  };

  return (
    <Container flexDirection="column">
      <div>
        <Container flexDirection="row">
          <Container flexDirection={'column'}>
            <h1>UserArea</h1>
          </Container>
          <div style={{ margin: 'auto 10px auto auto' }}>
            <UserInputArea />
          </div>
          <div>
            <AuthLoginButton />
          </div>
        </Container>
      </div>
      <hr />
      {children}
    </Container>
  );
};
