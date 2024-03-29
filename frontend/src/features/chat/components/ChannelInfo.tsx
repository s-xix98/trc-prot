import { useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useGetInviter, useChatRoomStatus } from '@/hooks/useCurrentUser';
import { Input } from '@/components/Elements/Input/Input';

import { useRoomMembers } from '../api/roomMembers';
import { chatChannelDto } from '../types/chatChannelDto';
import { useJoinChannel } from '../api/joinChannel';
import { useLeaveChatRoom } from '../api/leaveChatRoom';
import { useAcceptChatInvitation } from '../api/acceptInvite';
import { useRejectChatInvitation } from '../api/inviteChannel';

import { ChannelInvite } from './ChatInvite';
import { ShowChatRoomMembers } from './ChatRoomMembers';

const ChannelInfoHeader = ({
  selectedChannel,
  setSelectedChannel,
}: {
  selectedChannel: chatChannelDto;
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const modal = useModal();
  const leaveChatRoomEmitter = useLeaveChatRoom();

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
  setSelectedChannel,
}: {
  selectedChannel: chatChannelDto;
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const { roomMembers } = useRoomMembers(selectedChannel.id);

  return (
    <Container flexDirection={'column'}>
      <ChannelInfoHeader
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />
      <br />
      <ShowChatRoomMembers
        selectedChannel={selectedChannel}
        roomMembers={roomMembers}
      />
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
  const [password, setPassword] = useState<string>();
  const joinChannel = useJoinChannel();

  // TODO : input で改行できちゃうます。
  // Input自体をを改行不可にする予定
  return (
    <>
      <Input
        msg={password}
        placeholder="password"
        onChangeAct={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() => {
          joinChannel.emit(selectedChannel.id, password);
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
      <br />
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
  setSelectedChannel,
}: {
  selectedChannel: chatChannelDto;
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const { isJoinedRoom } = useChatRoomStatus();

  return (
    <>
      {isJoinedRoom(selectedChannel) ? (
        <JoinedChannelInfo
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      ) : (
        <NotJoinedChannelInfo selectedChannel={selectedChannel} />
      )}
    </>
  );
};

export const ChannelInfoModal = ({
  selectedChannel,
  setSelectedChannel,
  modalIsOpen,
  closeModal,
}: {
  selectedChannel: chatChannelDto | undefined;
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
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
      {selectedChannel && (
        <ChannelInfo
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      )}
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
      <ChannelInfoModal
        selectedChannel={selectingChannel}
        setSelectedChannel={setSelectingChannel}
        {...modal}
      />
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
