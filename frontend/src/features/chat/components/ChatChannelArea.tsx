import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

export const ChatChannelArea = ({
  setSelectedChannel,
}: {
  setSelectedChannel: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const channels: string[] = [];
  for (let n = 0; n < 100; n++) {
    channels.push(`hoge ${n}`);
  }
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const roomName = e.currentTarget.innerText;
    setSelectedChannel(roomName);
  };
  return (
    <Container flexDirection={'column'}>
      <h2>ChatChannelArea</h2>
      <hr />
      <Container flexDirection={'column'}>
        <ContainerItem overflowY={'scroll'}>
          {channels.map((channel, idx) => (
            <p key={idx} onClick={handleClick} style={{ cursor: 'pointer' }}>
              {channel}{' '}
            </p>
          ))}
        </ContainerItem>
      </Container>
    </Container>
  );
};
