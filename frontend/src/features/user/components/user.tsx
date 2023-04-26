import { ReactNode } from 'react';
import { Container } from '@/components/Layout/Container';

export const User = ({ children }: { children: ReactNode }) => {
  return (
    <Container flexDirection="column">
      <h1>UserArea</h1>
      <hr />
      {children}
    </Container>
  );
};
