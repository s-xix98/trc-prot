import { ReactNode, useState } from 'react';

import { Container } from '@/components/Layout/Container';

import { UserInfo } from '../types/UserDto';

import { Login } from './login';

export const User = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  return (
    <Container flexDirection="column">
      <div>
        <Container flexDirection="row">
          <h1>UserArea</h1>
          <div style={{ margin: 'auto 10px auto auto' }}>
            <Login setUserInfo={setUserInfo} />
          </div>
        </Container>
      </div>
      <hr />
      {children}
    </Container>
  );
};
