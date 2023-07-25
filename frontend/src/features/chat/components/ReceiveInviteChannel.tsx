import { ModalView } from '@/components/Elements/Modal/ModalView';
import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useModal } from '@/hooks/useModal';

import { ChannelListWithModal } from './ChannelInfo';

export const ReceiveInviteChannel = () => {
  const { receiveInviteChatRooms } = useCurrentUser();

  return (
    <Container flexDirection="column">
      <h2>ReceiveInviteChannels</h2>
      <ContainerItem overflowY="scroll">
        <ChannelListWithModal
          channelList={receiveInviteChatRooms.map((r) => r.chatRoom)}
        />
      </ContainerItem>
    </Container>
  );
};

export const ReceiveInviteChannelModal = () => {
  const modal = useModal();

  return (
    <>
      <p onClick={() => modal.openModal()}>ReceiveInviteChannel</p>
      <ModalView {...modal} width="200px" height="250px">
        <ReceiveInviteChannel />
      </ModalView>
    </>
  );
};
