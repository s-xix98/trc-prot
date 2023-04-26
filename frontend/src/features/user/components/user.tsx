import { ReactNode } from 'react';
import { Container } from '@/components/Layout/Container';

import { Login } from './login';

export const User = ({ children }: { children: ReactNode }) => {
  return (
    <Container flexDirection="column">
      <div>
        <Container flexDirection="row">
          <h1>UserArea</h1>
          <div style={{ margin: 'auto 10px auto auto' }}>
            <Login />
          </div>
        </Container>
      </div>
      <hr />
      {children}
    </Container>
  );
};
