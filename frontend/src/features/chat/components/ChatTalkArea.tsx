import { useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { useSocket } from '@/hooks/useSocket';
import { useScroll } from '@/hooks/useScroll';

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
  const [chatHistMsgs, setchatHistMsgs] = useState<handleMessageDto[]>([]);

  const { scrollBottomRef, handleScroll } = useScroll(chatHistMsgs);

  const onMessage = (data: handleMessageDto[]) => {
    handleScroll();
    setchatHistMsgs(data);
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
      <ChatInput  selectedChannel={selectedChannel}/>
    </Container>
  );
};
