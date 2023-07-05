import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useModal } from '@/hooks/useModal';

import { chatChannelDto } from '../types/chatChannelDto';

import { ChannelInfo } from './ChannelInfo';

export const ChatTalkAreaHeader = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const modal = useModal();
  return (
    <>
      <ModalView {...modal} height="250px" width="200px">
        <ChannelInfo selectedChannel={selectedChannel} />
      </ModalView>
      <h2
        onClick={() => {
          modal.openModal();
        }}
      >
        ChatTalkArea {selectedChannel.roomName}
      </h2>
      <hr />
    </>
  );
};
