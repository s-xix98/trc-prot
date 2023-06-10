'use client';
import Modal from 'react-modal';
import { useState } from 'react';
import { TextField } from '@mui/material';
import { useAtomValue } from 'jotai';

import { socket } from '@/socket';
import { userInfoAtom } from '@/App';
import { useSocket } from '@/hooks/useSocket';

import { CreateChannelDto } from '../types/CreateChannelDto';

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
  },
};

export const ChatChannelCreateModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const userinfo = useAtomValue(userInfoAtom);

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const onClick = () => {
    setModalIsOpen(true);
  };

  // TODO roomの情報が返ってきてらチャットリストの更新をする必要があるから
  // chatの一番上の階層で一番上の階層で宣言するのがいいかも
  // eslint-disable-next-line
  useSocket('createChannel', (createdRoom: any) => {
    console.log(createdRoom);
  });

  const onSubmit = () => {
    const createChannelDto: CreateChannelDto = {
      roomName,
      userId: userinfo?.id || '',
    };
    socket.emit('createChannel', createChannelDto);
    closeModal();
  };

  return (
    <div>
      <div onClick={onClick}>ChannelCreate</div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h5>ChannelCreate</h5>
        <TextField
          label="ChannelName"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={closeModal}>cancel</button>
        <button onClick={onSubmit}> create </button>
      </Modal>
    </div>
  );
};
