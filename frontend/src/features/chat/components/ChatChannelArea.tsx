import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { socket } from '@/socket';


import { chatChannelDto } from '../types/chatChannelDto';
import { joinChannelDto } from '../types/joinChannelDto';

import { ChatChannelCreateModal } from './ChatChannelCreateModal';

import { UserInfo } from '../../../features/user/types/UserDto';

export const ChatChannelArea = ({
  userInfo,
  channels,
  setSelectedChannel,
}: {
  userInfo: UserInfo;
  channels: chatChannelDto[];
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const handleClick = (channel: chatChannelDto) => {
    const dto: joinChannelDto = {
      userId: userInfo.id,
      chatRoomId: channel.id,
    };
    socket.emit('joinChannel', dto);
    setSelectedChannel(channel);
  };

  return (
    <Container flexDirection={'column'}>
      <h2>ChatChannelArea</h2>
      <hr />
      <Container flexDirection={'column'}>
        <ChatChannelCreateModal />
        <hr />
        <Container flexDirection={'column'}>
          <ContainerItem overflowY={'scroll'}>
            {channels.map((channel, idx) => (
              <p
                key={idx}
                onClick={() => handleClick(channel)}
                style={{ cursor: 'pointer' }}
              >
                {channel.roomName}
              </p>
            ))}
          </ContainerItem>
        </Container>
      </Container>
    </Container>
  );
};
