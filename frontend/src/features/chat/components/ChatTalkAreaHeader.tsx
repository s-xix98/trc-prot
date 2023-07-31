import { IconButton } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';

import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useModal } from '@/hooks/useModal';
import { Container } from '@/components/Layout/Container';

import { chatChannelDto } from '../types/chatChannelDto';
import { useUpdateChatRoom } from '../api/updateChatRoom';

import { ChannelInfo } from './ChannelInfo';


const ShowPrivateState = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { setIsPrivate } = useUpdateChatRoom();

  return (
    <>
      {selectedChannel.isPrivate === true && (
        <IconButton
          color="primary"
          size="small"
          onClick={() => setIsPrivate(selectedChannel.id, false)}
        >
          <PublicOffIcon />
        </IconButton>
      )}
      {selectedChannel.isPrivate === false && (
        <IconButton
          color="primary"
          size="small"
          onClick={() => setIsPrivate(selectedChannel.id, true)}
        >
          <PublicIcon />
        </IconButton>
      )}
    </>
  );
};

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
      <div>
        <Container>
          <h2
            onClick={() => {
              modal.openModal();
            }}
            style={{ margin: 'auto auto auto 3px' }}
          >
            ChatTalkArea {selectedChannel.roomName}
          </h2>
          <div style={{ margin: 'auto 10px auto auto' }}>
            <ShowPrivateState selectedChannel={selectedChannel} />
          </div>
        </Container>
      </div>
    </>
  );
};
