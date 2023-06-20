import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

import { chatChannelDto } from '../types/chatChannelDto';
import { useJoinChannel } from '../api/joinChannel';

import { ChatChannelCreateModal } from './ChatChannelCreateModal';

export const ChatChannelArea = ({
  channels,
  setSelectedChannel,
}: {
  channels: chatChannelDto[];
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<chatChannelDto | undefined>
  >;
}) => {
  const joinChannel = useJoinChannel();

  const handleClick = (channel: chatChannelDto) => {
    joinChannel.emit(channel.id);
    setSelectedChannel(channel);
  };

  return (
    <Container flexDirection={'column'}>
      <h2>ChatChannelArea</h2>
      <hr />
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
  );
};
