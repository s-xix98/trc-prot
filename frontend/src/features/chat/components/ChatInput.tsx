import { useState } from 'react';
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

  const onKeyDownAct = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault(); // 改行を入力しない
      sendMessage.emit(selectedChannel.id, msg);
      setMsg('');
    }
  };

  return (
    <>
      <Input
        msg={msg}
        start={'> '}
        maxRows={1.5}
        onKeyDownAct={onKeyDownAct}
        onChangeAct={(e) => {
          setMsg(e.target.value);
        }}
      />
    </>
  );
};
