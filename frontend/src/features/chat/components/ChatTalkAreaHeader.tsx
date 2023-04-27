import { Container } from '@/components/Layout/Container';
import { socket } from '@/socket';
import { BasicButton } from '@/components/Elements/Button/BasicButton';
import { useAtomValue } from 'jotai';
import { userInfoAtom } from '@/App';

export const ChatTalkAreaHeader = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const onGetChatLogAct = () => {
    console.log('OnGetChatLogButton');
    socket.emit('getPastMessages', userInfo?.id);
  };
  return (
    <>
      <div>
        <Container flexDirection="row">
          <h2>ChatTalkArea</h2>
          <div style={{ margin: '0px 10px 0px auto' }}>
            <BasicButton btnAct={onGetChatLogAct}>Get History</BasicButton>
          </div>
        </Container>
      </div>
      <hr />
    </>
  );
};
