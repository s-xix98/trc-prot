import { useState } from 'react';
import { ChangeEvent } from 'react';

import { postMessage } from '../api/postMessage';
import { socket } from '@/socket';
import { Input } from '@/components/Elements/Input/Input';
import { SendButton } from '@/components/Elements/Button/SendButton';
import { Container } from '@/components/Layout/Container';

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
    postMessage(`${socket.id.substring(0, 4)} > ${msg}`);
    // バックエンドで post の方に クライアントに 送信したもの返す実装が現状ないので
    // socket の方も残したまま (送信したものが表示されないため)
    // 送信したもの送り返すかどうかも、そもそも検討 (そのまま chatHistMsgs に追加するなど )
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
