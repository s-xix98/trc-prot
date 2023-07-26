import { useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useChatRoomStatus } from '@/hooks/useCurrentUser';
import { UserListWithModal } from '@/features/user/components/UserProfile';

import { useRoomMembers } from '../api/roomMembers';
import { chatChannelDto } from '../types/chatChannelDto';
import { useJoinChannel } from '../api/joinChannel';

import { ChannelInvite } from './ChatInvite';

const ChannelInfoHeader = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const modal = useModal();

  return (
    <div>
      <ModalView {...modal} height="250px" width="200px">
        <ChannelInvite selectedChannel={selectedChannel} />
      </ModalView>
      <Container>
        <h3>{selectedChannel.roomName}</h3>
        <div style={{ margin: 'auto 10px auto auto' }}>
          <button onClick={() => modal.openModal()}>Invite</button>
        </div>
      </Container>
    </div>
  );
};

export const JoinedChannelInfo = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { roomMembers } = useRoomMembers(selectedChannel.id);

  return (
    <Container flexDirection={'column'}>
      <ChannelInfoHeader selectedChannel={selectedChannel} />
      <br />
      <ContainerItem overflowY="scroll">
        <UserListWithModal userList={roomMembers} />
      </ContainerItem>
    </Container>
  );
};

const NotJoinedChannelInfo = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const joinChannel = useJoinChannel();

  return (
    <div>
      <h3>{selectedChannel.roomName}</h3>
      <button
        onClick={() => {
          joinChannel.emit(selectedChannel.id);
        }}
      >
        join
      </button>
    </div>
  );
};

export const ChannelInfo = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { isJoinedRoom } = useChatRoomStatus();

  return (
    <>
      {isJoinedRoom(selectedChannel) ? (
        <JoinedChannelInfo selectedChannel={selectedChannel} />
      ) : (
        <NotJoinedChannelInfo selectedChannel={selectedChannel} />
      )}
    </>
  );
};

export const ChannelInfoModal = ({
  selectedChannel,
  modalIsOpen,
  closeModal,
}: {
  selectedChannel: chatChannelDto | undefined;
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <ModalView
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      height="50%"
      width="30%"
    >
      {!selectedChannel && <p>channel is not selecting</p>}
      {selectedChannel && <ChannelInfo selectedChannel={selectedChannel} />}
    </ModalView>
  );
};

export const ChannelListWithModal = ({
  channelList,
}: {
  channelList: chatChannelDto[];
}) => {
  const modal = useModal();
  const [selectingChannel, setSelectingChannel] = useState<chatChannelDto>();

  return (
    <>
      <ChannelInfoModal selectedChannel={selectingChannel} {...modal} />
      {channelList.map((channel, idx) => (
        <p
          key={idx}
          onClick={() => {
            setSelectingChannel(channel);
            modal.openModal();
          }}
        >
          {channel.roomName}
        </p>
      ))}
    </>
  );
};
