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
          <div style={{ margin: '5px' }} />
          <LoginForm setUserInfo={(v) => setUserInfo(v)} />
        </div>
      );
    }
  };

  return (
    <Container flexDirection="column">
      <div>
        <Container flexDirection="row">
          <h1
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            UserArea
          </h1>
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
