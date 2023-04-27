import { ReactNode, useState } from 'react';

import { Container } from '@/components/Layout/Container';

import { UserInfo } from '../types/UserDto';

import { LoginForm } from './login';

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
      return <LoginForm setUserInfo={setUserInfo} />;
    }
  };

  return (
    <Container flexDirection="column">
      <div>
        <Container flexDirection="row">
          <h1>UserArea</h1>
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
