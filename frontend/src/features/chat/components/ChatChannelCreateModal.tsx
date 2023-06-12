import { useState } from 'react';
import { TextField } from '@mui/material';
import { useAtomValue } from 'jotai';

import { socket } from '@/socket';
import { userInfoAtom } from '@/App';
import { useSocket } from '@/hooks/useSocket';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';

import { CreateChannelDto } from '../types/CreateChannelDto';

export const ChatChannelCreateModal = () => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  const [roomName, setRoomName] = useState('');
  const userinfo = useAtomValue(userInfoAtom);

  // TODO roomの情報が返ってきてらチャットリストの更新をする必要があるから
  // chatの一番上の階層で一番上の階層で宣言するのがいいかも
  // eslint-disable-next-line
  useSocket('createChannel', (createdRoom: any) => {
    console.log(createdRoom);
  });

  const onSubmit = () => {
    const dto: CreateChannelDto = {
      roomName,
      userId: userinfo?.id || '',
    };
    socket.emit('createChannel', dto);
    closeModal();
  };

  return (
    <div>
      <div onClick={() => openModal()}>ChannelCreate</div>
      <ModalView
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        width="200px"
        height="250px"
      >
        <div>
          <h5>ChannelCreate</h5>
          <br />
          <TextField
            label="ChannelName"
            variant="outlined"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button onClick={closeModal}>cancel</button>
          <button onClick={onSubmit}> create </button>
        </div>
      </ModalView>
    </div>
  );
};
