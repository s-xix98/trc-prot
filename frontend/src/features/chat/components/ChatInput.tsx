import { useState } from 'react';
import { ChangeEvent } from 'react';

import { Input } from '@/components/Elements/Input/Input';
import { SendButton } from '@/components/Elements/Button/SendButton';
import { Container } from '@/components/Layout/Container';

import { chatChannelDto } from '../types/chatChannelDto';
import { useSendMessage } from '../api/sendMsg';

export const ChatInput = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const [msg, setMsg] = useState('');
  const sendMessage = useSendMessage();

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
    sendMessage.emit(selectedChannel.id, msg);
    setMsg('');
  };

  return (
    <>
      <div>
        <Container>
          <Container>
            <p style={{ margin: 'auto' }}>&nbsp;&gt;&nbsp;</p>
            <Input msg={msg} onChangeAct={onChangeAct} />
          </Container>
          <SendButton sendBtnAct={sendBtnAct} />
        </Container>
      </div>
    </>
  );
};
