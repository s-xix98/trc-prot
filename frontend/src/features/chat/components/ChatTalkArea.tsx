import { useState, useEffect } from 'react';

import { Container } from '@/components/Layout/Container';
import { socket } from '@/socket';
import { useScroll } from '@/hooks/useScroll';

import { handleMessageDto } from '../types/MessageDto';

import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { ChatTalkAreaHeader } from './ChatTalkAreaHeader';

export const ChatTalkArea = () => {
  const [chatHistMsgs, setchatHistMsgs] = useState<handleMessageDto[]>([]);

  const { scrollBottomRef, handleScroll } = useScroll(chatHistMsgs);

  const onMessage = (data: handleMessageDto) => {
    handleScroll();
    setchatHistMsgs((chatHistMsgs) => [...chatHistMsgs, data]);
  };

  const onGetChatLog = (chatlog: handleMessageDto[]) => {
    console.log('onGetChatLog', chatlog);
    setchatHistMsgs(chatlog);
  };

  useEffect(() => {
    socket.on('message', onMessage);
    socket.on('getPastMessages', onGetChatLog);

    return () => {
      socket.off('message', onMessage);
      socket.off('getPastMessages', onGetChatLog);
    };
  }, []);

  return (
    <Container flexDirection={'column'}>
      <ChatTalkAreaHeader />
      <ChatHistory
        chatHistMsgs={chatHistMsgs}
        scrollBottomRef={scrollBottomRef}
      />
      <ChatInput />
    </Container>
  );
};
