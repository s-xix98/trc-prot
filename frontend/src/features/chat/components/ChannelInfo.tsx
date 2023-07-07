import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

import { chatChannelDto } from '../types/chatChannelDto';
import { useRoomMembers } from '../api/roomMembers';

export const ChannelInfo = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { roomMembers } = useRoomMembers(selectedChannel.id);

  return (
    <Container flexDirection={'column'}>
      <ContainerItem overflowY="scroll">
        <h3>{selectedChannel.roomName}</h3>
        <br />
        {roomMembers.map((r, idx) => (
          <p key={idx}>{r.username}</p>
        ))}
      </ContainerItem>
    </Container>
  );
};
