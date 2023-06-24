import { ReactNode } from 'react';
import { useAtom } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { userInfoAtom } from '@/stores/jotai';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';

import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export const User = ({ children }: { children: ReactNode }) => {
  const [userInfo] = useAtom(userInfoAtom);
  const { modalIsOpen, openModal, closeModal } = useModal();

  const UserInputArea = () => {
    if (userInfo) {
      return (
        <div>
          <button
            onClick={() => {
              openModal();
            }}
          >
            botton
          </button>
          <p>name : {userInfo?.username}</p>
          <ModalView modalIsOpen={modalIsOpen} closeModal={closeModal}>
            <p>
              id : {userInfo?.id}, name : {userInfo?.username}
            </p>
          </ModalView>
        </div>
      );
    } else {
      return (
        <div style={{ margin: '10px auto 10px auto' }}>
          <div style={{ textAlign: 'right' }}>
            <SignUpForm />
          </div>
          <div style={{ textAlign: 'right' }}>
            <LoginForm />
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
