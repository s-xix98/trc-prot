import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

import { ChatChannelCreateModal } from './ChatChannelCreateModal';
import { useAtomValue } from 'jotai';
import { channelListAtom } from '../../../App';
export const ChatChannelArea = ({
  setSelectedChannel,
}: {
  setSelectedChannel: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const channels = useAtomValue(channelListAtom);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const roomName = e.currentTarget.innerText;
    setSelectedChannel(roomName);
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
              <p key={idx} onClick={handleClick} style={{ cursor: 'pointer' }}>
                {channel.roomName}
              </p>
            ))}
          </ContainerItem>
        </Container>
      </Container>
    </Container>
  );
};
