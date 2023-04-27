import { ReactNode, useState } from 'react';

import { Container } from '@/components/Layout/Container';

import { UserInfo } from '../types/UserDto';

import { LoginForm } from './login';
import { SignUpForm } from './SignUp';

export const User = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();

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
        </Container>
      </div>
      <hr />
      {children}
    </Container>
  );
};
