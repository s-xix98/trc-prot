import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { chatChannelDto } from '../types/chatChannelDto';

import { ChatChannelCreateModal } from './ChatChannelCreateModal';
import { ChannelSearchModal } from './ChannelSearchModal';
import { ReceiveInviteChannelModal } from './ReceiveInviteChannel';

export const ChatChannelArea = ({
  channels,
  setSelectedChannel,
}: {
  channels: chatChannelDto[];
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const { currentUserInfo } = useCurrentUser();

  const handleClick = (channel: chatChannelDto) => {
    setSelectedChannel(channel);
  };

  const getDisplayRoomName = (room: chatChannelDto) => {
    if (room.isDM === true) {
      const target = room.roomMembers?.find(
        (roomMember) => roomMember.user.id !== currentUserInfo?.id,
      );
      return `DM ${target?.user.username}`;
    }
    return room.roomName;
  };

  return (
    <Container flexDirection={'column'}>
      <h2>ChatChannelArea</h2>
      <hr />
      <ChatChannelCreateModal />
      <hr />
      <ChannelSearchModal />
      <hr />
      <ReceiveInviteChannelModal />
      <hr />
      <Container flexDirection={'column'}>
        <ContainerItem overflowY={'scroll'}>
          {channels.map((channel, idx) => (
            <p
              key={idx}
              onClick={() => handleClick(channel)}
              style={{ cursor: 'pointer' }}
            >
              {getDisplayRoomName(channel)}
            </p>
          ))}
        </ContainerItem>
      </Container>
    </Container>
  );
};
