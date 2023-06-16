import { useAtomValue } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { socket } from '@/socket';
import { BasicButton } from '@/components/Elements/Button/BasicButton';
import { userInfoAtom } from '@/stores/jotai';

export const ChatTalkAreaHeader = ({ roomName }: { roomName: string }) => {
  const userInfo = useAtomValue(userInfoAtom);
  const onGetChatLogAct = () => {
    console.log('OnGetChatLogButton');
    socket.emit('getPastMessages', userInfo?.id);
  };
  return (
    <>
      <div>
        <Container flexDirection="row">
          <h2>ChatTalkArea {roomName}</h2>
          <div style={{ margin: '0px 10px 0px auto' }}>
            <BasicButton btnAct={onGetChatLogAct}>Get History</BasicButton>
          </div>
        </Container>
      </div>
      <hr />
    </>
  );
};
