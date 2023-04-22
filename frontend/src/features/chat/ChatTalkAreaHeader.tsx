import { Container } from '../../components/Layout/Container';
import { socket } from '../../socket';
import { BasicButton } from '../../components/Elements/Button/BasicButton';

const onGetChatLogAct = () => {
  console.log('OnGetChatLogButton');
  socket.emit('getPastMessages', 1);
};

export const ChatTalkAreaHeader = () => {
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
