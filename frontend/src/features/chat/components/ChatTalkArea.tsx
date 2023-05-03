import { useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { useSocket } from '@/hooks/useSocket';
import { useScroll } from '@/hooks/useScroll';

import { handleMessageDto } from '../types/MessageDto';

import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { ChatTalkAreaHeader } from './ChatTalkAreaHeader';

export const ChatTalkArea = ({
  selectedChannel,
}: {
  selectedChannel: string;
}) => {
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

  useSocket('message', onMessage);
  useSocket('getPastMessages', onGetChatLog);

  return (
    <Container flexDirection={'column'}>
      <ChatTalkAreaHeader roomName={selectedChannel} />
      <ChatHistory
        chatHistMsgs={chatHistMsgs}
        scrollBottomRef={scrollBottomRef}
      />
      <ChatInput />
    </Container>
  );
};
