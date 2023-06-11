import { useAtomValue } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { socket } from '@/socket';
import { BasicButton } from '@/components/Elements/Button/BasicButton';
import { userInfoAtom, selectedChannelAtom } from '@/App';

export const ChatTalkAreaHeader = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const selectedChannel = useAtomValue(selectedChannelAtom);
  const onGetChatLogAct = () => {
    console.log('OnGetChatLogButton');
    socket.emit('getPastMessages', userInfo?.id);
  };
  return (
    <>
      <div>
        <Container flexDirection="row">
          <h2>ChatTalkArea {selectedChannel?.roomName}</h2>
          <div style={{ margin: '0px 10px 0px auto' }}>
            <BasicButton btnAct={onGetChatLogAct}>Get History</BasicButton>
          </div>
        </Container>
      </div>
      <hr />
    </>
  );
};
