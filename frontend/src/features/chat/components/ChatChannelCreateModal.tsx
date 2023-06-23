import { useState } from 'react';
import { TextField } from '@mui/material';

import { useSocket } from '@/hooks/useSocket';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';

import { useCreateChannel } from '../api/createChannel';

export const ChatChannelCreateModal = () => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  const [roomName, setRoomName] = useState('');
  const createChannel = useCreateChannel();

  // TODO roomの情報が返ってきてらチャットリストの更新をする必要があるから
  // chatの一番上の階層で一番上の階層で宣言するのがいいかも
  // eslint-disable-next-line
  useSocket('createChannel', (createdRoom: any) => {
    console.log(createdRoom);
  });

  const onSubmit = () => {
    createChannel.emit(roomName);
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
          {/* TODO : MUI の方の色も変えたりしたい */}
          <TextField
            label="ChannelName"
            variant="outlined"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <br />
          <br />
          <button
            style={{ color: '#33ff33', background: '#353535' }}
            onClick={closeModal}
          >
            cancel
          </button>
          <button
            style={{ color: '#33ff33', background: '#353535' }}
            onClick={onSubmit}
          >
            create
          </button>
        </div>
      </ModalView>
    </div>
  );
};
