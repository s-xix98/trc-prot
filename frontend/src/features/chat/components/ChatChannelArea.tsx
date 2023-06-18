import { useAtomValue } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { channelListAtom, userInfoAtom } from '@/stores/jotai';
import { socket } from '@/socket';

import { chatChannelDto } from '../types/chatChannelDto';
import { joinChannelDto } from '../types/joinChannelDto';

import { ChatChannelCreateModal } from './ChatChannelCreateModal';

export const ChatChannelArea = ({
  setSelectedChannel,
}: {
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const channels = useAtomValue(channelListAtom);
  const user = useAtomValue(userInfoAtom);

  const handleClick = (channel: chatChannelDto) => {
    const dto: joinChannelDto = {
      userId: user?.id || '',
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
