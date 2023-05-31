'use client';
import Modal from 'react-modal';

import { UserInfo } from '../types/UserDto';

Modal.setAppElement('body');
export const UserDetailsModal = ({
  userInfo,
  modalIsOpen,
  closeModal,
}: {
  userInfo: UserInfo;
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
      <p>
        id : {userInfo?.id}, name : {userInfo?.nickname}
      </p>
    </Modal>
  );
};
