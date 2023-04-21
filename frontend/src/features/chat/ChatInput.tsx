import { ChangeEvent } from 'react';
import { socket } from '../../socket';

import { Input } from '../../components/Elements/Input/Input';
import { SendButton } from '../../components/Elements/Button/SendButton';

import { Container } from '../../components/Layout/Container';
import { useState } from 'react';

export const ChatInput = () => {
  const [msg, setMsg] = useState('');
  const onChangeAct = (e: ChangeEvent<HTMLInputElement>) => {
    // TODO : Shift + Enter で 改行を入れられるようにとかしたい
    if (e.target.value.slice(-1) === '\n') {
      if (e.target.value.length === 1) {
        return;
      }
      sendBtnAct();
      return;
    }
    setMsg(e.target.value);
  };

  const sendBtnAct = () => {
    socket.emit('message', msg);
    setMsg('');
  };

  return (
    <>
      <div>
        <Container>
          <Input msg={msg} onChangeAct={onChangeAct} />
          <SendButton sendBtnAct={sendBtnAct} />
        </Container>
      </div>
    </>
  );
};
