import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';

import { useRoomMembers } from '../api/roomMembers';
import { chatChannelDto } from '../types/chatChannelDto';

import { ChannelInvite } from './ChatInvite';

const ChannelInfoHeader = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const modal = useModal();

  return (
    <div>
      <ModalView {...modal} height="250px" width="200px">
        <ChannelInvite selectedChannel={selectedChannel} />
      </ModalView>
      <Container>
        <h3>{selectedChannel.roomName}</h3>
        <div style={{ margin: 'auto 10px auto auto' }}>
          <button onClick={() => modal.openModal()}>Invite</button>
        </div>
      </Container>
    </div>
  );
};

export const ChannelInfo = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { roomMembers } = useRoomMembers(selectedChannel.id);

  return (
    <Container flexDirection={'column'}>
      <ChannelInfoHeader selectedChannel={selectedChannel} />
      <ContainerItem overflowY="scroll">
        <br />
        {roomMembers.map((r, idx) => (
          <p key={idx}>{r.username}</p>
        ))}
      </ContainerItem>
    </Container>
  );
};
