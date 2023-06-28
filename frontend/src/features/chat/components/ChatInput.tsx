import { useState } from 'react';
import { ChangeEvent } from 'react';
import { KeyboardEvent } from 'react';

import { Input } from '@/components/Elements/Input/Input';

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
    setMsg(e.target.value);
  };

  const onKeyDownAct = (e: KeyboardEvent<HTMLDivElement>) => {
    // TODO : Shift + Enter で 改行を入れられるようにとかしたい
    if (e.key !== 'Enter') {
      return;
    }

    sendMessage.emit(selectedChannel.id, msg);
    setMsg('');
  };

  return (
    <>
      <Input
        msg={msg}
        start={'> '}
        onChangeAct={onChangeAct}
        onKeyDownAct={onKeyDownAct}
      />
    </>
  );
};
