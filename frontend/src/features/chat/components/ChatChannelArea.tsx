import { useAtomValue, useSetAtom } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

import { ChatChannelCreateModal } from './ChatChannelCreateModal';

import { channelListAtom,selectedChannelAtom } from '../../../App';
import { chatChannelDto } from '../types/chatChannelDto';
export const ChatChannelArea = () => {
  const channels = useAtomValue(channelListAtom);
  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleClick = (channel: chatChannelDto) => {
    return () =>{
      setSelectedChannel(channel);
    };
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
              <p key={idx} onClick={handleClick(channel)} style={{ cursor: 'pointer' }}>
                {channel.roomName}
              </p>
            ))}
          </ContainerItem>
        </Container>
      </Container>
    </Container>
  );
};
