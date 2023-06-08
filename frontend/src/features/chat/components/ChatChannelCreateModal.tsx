'use client';
import Modal from 'react-modal';
import { useState } from 'react';

Modal.setAppElement('body');

export const ChatChannelCreateModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const onClick = () => {
    setModalIsOpen(true);
  };
  return (
    <div>
      <div onClick={onClick}>ChannelCreate</div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}>
        </Modal>
    </div>
  );
}