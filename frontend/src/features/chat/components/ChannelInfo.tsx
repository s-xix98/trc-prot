import { useState } from 'react';
import { useSetAtom } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useGetInviter, useChatRoomStatus } from '@/hooks/useCurrentUser';
import { selectedChannelAtom } from '@/stores/chatState';
import { UserListWithModal } from '@/features/user/components/UserProfile';

import { useRoomMembers } from '../api/roomMembers';
import { chatChannelDto } from '../types/chatChannelDto';
import { useJoinChannel } from '../api/joinChannel';
import { useLeaveChatRoom } from '../api/leaveChatRoom';
import { useAcceptChatInvitation } from '../api/acceptInvite';
import { useRejectChatInvitation } from '../api/inviteChannel';

import { ChannelInvite } from './ChatInvite';

const ChannelInfoHeader = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const modal = useModal();
  const leaveChatRoomEmitter = useLeaveChatRoom();
  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  return (
    <div>
      <ModalView {...modal} height="250px" width="200px">
        <ChannelInvite selectedChannel={selectedChannel} />
      </ModalView>
      <Container>
        <h3>{selectedChannel.roomName}</h3>
        <div style={{ margin: 'auto 10px auto auto' }}>
          <button onClick={() => modal.openModal()}>Invite</button>
          <button
            onClick={() => {
              leaveChatRoomEmitter.emit(selectedChannel.id);
              setSelectedChannel(undefined);
            }}
          >
            Leave
          </button>
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

const AcceptInviteAndRejectInviteButton = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const acceptChatInvitation = useAcceptChatInvitation();
  const rejectChatInvitation = useRejectChatInvitation();
  const inviter = useGetInviter(selectedChannel);

  const acceptInvite = () => {
    if (inviter === undefined) {
      console.log('inviter is undef');
      return;
    }
    acceptChatInvitation.emit(selectedChannel.id, inviter.id);
  };

  const rejectInvite = () => {
    if (inviter === undefined) {
      console.log('inviter is undef');
      return;
    }
    rejectChatInvitation.emit(selectedChannel.id, inviter.id);
  };

  return (
    <>
      <button onClick={acceptInvite}>AcceptInvite</button>
      <button onClick={rejectInvite}>RejectInvite</button>
    </>
  );
};

const JoinChannelButton = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const joinChannel = useJoinChannel();

  return (
    <>
      <button
        onClick={() => {
          joinChannel.emit(selectedChannel.id);
        }}
      >
        join
      </button>
    </>
  );
};

const NotJoinedChannelInfo = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { isInvitedRoom } = useChatRoomStatus();

  return (
    <div>
      <h3>{selectedChannel.roomName}</h3>
      {isInvitedRoom(selectedChannel) ? (
        <AcceptInviteAndRejectInviteButton selectedChannel={selectedChannel} />
      ) : (
        <JoinChannelButton selectedChannel={selectedChannel} />
      )}
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
