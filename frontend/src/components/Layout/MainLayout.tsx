import { ReactNode } from 'react';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';

import { Container } from './Container';
import { ContainerItem } from './ContainerItem';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Container flexDirection={'column'}>
      <Header />
      <ContainerItem>{children}</ContainerItem>
      <Footer />
    </Container>
  );
};
