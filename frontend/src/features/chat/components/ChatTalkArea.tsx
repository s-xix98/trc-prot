import { useEffect, useState } from 'react';
import axios from 'axios';

import { Container } from '@/components/Layout/Container';
import { useSocket } from '@/hooks/useSocket';
import { useScroll } from '@/hooks/useScroll';
import { BACKEND } from '@/constants';

import { handleMessageDto } from '../types/MessageDto';
import { chatChannelDto } from '../types/chatChannelDto';

import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { ChatTalkAreaHeader } from './ChatTalkAreaHeader';

export const ChatTalkArea = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const [chatHistMsgs, setChatHistMsgs] = useState<handleMessageDto[]>([]);

  const { scrollBottomRef, handleScroll } = useScroll(chatHistMsgs);

  useEffect(() => {
    axios
      .get(BACKEND + '/chat/rooms/' + selectedChannel?.id + '/history')
      .then((res) => {
        setChatHistMsgs(res.data);
      })
      .catch(() => {
        console.log('room 取得失敗');
      });
  }, [selectedChannel]);

  const onMessage = (data: handleMessageDto[]) => {
    handleScroll();
    setChatHistMsgs(data);
  };

  // TODO イベント名は適当だから後でかえる
  useSocket('sendMessage', onMessage);

  return (
    <Container flexDirection={'column'}>
      <ChatTalkAreaHeader roomName={selectedChannel?.roomName} />
      <ChatHistory
        chatHistMsgs={chatHistMsgs}
        scrollBottomRef={scrollBottomRef}
      />
      <ChatInput selectedChannel={selectedChannel} />
    </Container>
  );
};
