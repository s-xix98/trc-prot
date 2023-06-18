import { useState } from 'react';
import { ChangeEvent } from 'react';
import { useAtomValue } from 'jotai';

import { socket } from '@/socket';
import { Input } from '@/components/Elements/Input/Input';
import { SendButton } from '@/components/Elements/Button/SendButton';
import { Container } from '@/components/Layout/Container';
import { userInfoAtom } from '@/stores/jotai';

import { sendMessageDto } from '../types/MessageDto';
import { chatChannelDto } from '../types/chatChannelDto';

export const ChatInput = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const [msg, setMsg] = useState('');
  const userInfo = useAtomValue(userInfoAtom);

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
    if (userInfo === undefined) {
      console.log('Error : sendBtnAct : userInfo is undefined');
      return;
    }

    // バックエンドで post の方に クライアントに 送信したもの返す実装が現状ないので
    // socket の方も残したまま (送信したものが表示されないため)
    // 送信したもの送り返すかどうかも、そもそも検討 (そのまま chatHistMsgs に追加するなど )
    const dto: sendMessageDto = {
      content: msg,
      userId: userInfo.id,
      chatRoomId: selectedChannel.id,
    };

    socket.emit('sendMessage', dto);
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
