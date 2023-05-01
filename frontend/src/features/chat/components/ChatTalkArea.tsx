import { useState, useRef } from 'react';

import { Container } from '@/components/Layout/Container';
import { useSocket } from '@/hooks/useSocket';

import { handleMessageDto } from '../types/MessageDto';

import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { ChatTalkAreaHeader } from './ChatTalkAreaHeader';

const isScrollBottom = (scrollBottomRef: React.RefObject<HTMLDivElement>) => {
  const scrollParentElement = scrollBottomRef?.current?.parentElement;

  // TODO : is it ok to return false?
  if (scrollParentElement === undefined || scrollParentElement === null) {
    return false;
  }
  const scrollHeight = scrollParentElement.scrollHeight;
  const scrollTop = scrollParentElement.scrollTop;
  const clientHeight = scrollParentElement.clientHeight;

  // debug
  // console.log("scrollHeight", scrollHeight);
  // console.log("scrollTop", scrollTop);
  // console.log("clientHeight", clientHeight);
  // console.log(scrollTop + clientHeight);

  // TODO : is it ok to return false?
  if (
    scrollHeight === undefined ||
    scrollTop === undefined ||
    clientHeight === undefined
  ) {
    return false;
  }

  const isBtm = Math.abs(scrollHeight - (scrollTop + clientHeight)) <= 1;

  return isBtm;
};

export const ChatTalkArea = () => {
  const [chatHistMsgs, setchatHistMsgs] = useState<handleMessageDto[]>([]);

  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [isNeedScroll, setIsNeedScroll] = useState(false);

  const onMessage = (data: handleMessageDto) => {
    const needScroll = isScrollBottom(scrollBottomRef);
    setIsNeedScroll(() => needScroll);
    setchatHistMsgs((chatHistMsgs) => [...chatHistMsgs, data]);
    console.log('needScroll', needScroll);
  };

  const onGetChatLog = (chatlog: handleMessageDto[]) => {
    console.log('onGetChatLog', chatlog);
    setchatHistMsgs(chatlog);
  };

  useSocket('message', onMessage);
  useSocket('getPastMessages', onGetChatLog);

  return (
    <Container flexDirection={'column'}>
      <ChatTalkAreaHeader />
      <ChatHistory
        chatHistMsgs={chatHistMsgs}
        isNeedScroll={isNeedScroll}
        scrollBottomRef={scrollBottomRef}
      />
      <ChatInput />
    </Container>
  );
};
