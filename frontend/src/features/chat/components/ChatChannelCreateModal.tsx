'use client';
import Modal from 'react-modal';
import { useState } from 'react';
import { TextField } from '@mui/material';
Modal.setAppElement('body');

const customStyles = {
  content: {
    width: '200px',
    height: '250px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};

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
          onRequestClose={closeModal}
          style={customStyles}>

          <h5>ChannelCreate</h5>
          <TextField
          label="ChannelName"
          variant='outlined'
          />
          <button onClick={closeModal}>cancel</button>
          <button> create </button>
        </Modal>
    </div>
  );
}