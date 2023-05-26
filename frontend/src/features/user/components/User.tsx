'use client';
import { ReactNode, useState } from 'react';
import { useAtom } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { userInfoAtom } from '@/App';

import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import Modal from 'react-modal';
Modal.setAppElement('body');
export const User = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => {
    console.log('closeModal');
    setModalIsOpen(false);
  }
  const UserInputArea = () => {
    if (userInfo) {
      return (
        <div>
          <button onClick={()=>{setModalIsOpen(true)}}> botton </button>
        <p>
          id : {userInfo?.id}, name : {userInfo?.nickname}
        </p>
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        >
          <h1>aaa</h1>
        </Modal>
        </div>
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
