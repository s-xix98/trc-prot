import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { signIn } from 'next-auth/react';

import { Container } from '@/components/Layout/Container';
import { userInfoAtom } from '@/stores/jotai';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';

import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export const User = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
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
          <SignUpForm />
          <div style={{ margin: '5px 10px auto auto', textAlign: 'right' }}>
            <LoginForm />
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
