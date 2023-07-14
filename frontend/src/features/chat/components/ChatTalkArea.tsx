import { useEffect } from 'react';

import { Container } from '@/components/Layout/Container';
import { useSessionSocket } from '@/hooks/useSocket';
import { useScroll } from '@/hooks/useScroll';

import { handleMessageDto } from '../types/MessageDto';
import { chatChannelDto } from '../types/chatChannelDto';
import { useRoomHistory } from '../api/roomHistory';

import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { ChatTalkAreaHeader } from './ChatTalkAreaHeader';

export const ChatTalkArea = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  // TODO : storybook が 引数設定してなくて、selectedChannel が undef でくるので一旦、`?` は必要ないはず
  const { chatHistMsgs, setChatHistMsgs } = useRoomHistory(selectedChannel?.id);

  const { scrollBottomRef, handleScroll } = useScroll(chatHistMsgs);

  const onMessage = (data: handleMessageDto[]) => {
    handleScroll();
    setChatHistMsgs(data);
  };

  useSessionSocket('receiveMessage', onMessage);

  // TODO : handleScrollがちょっと多めに呼ばれちゃってるの改善したい
  // チャンネルを選択した時一番下まで行く
  useEffect(() => {
    handleScroll();
  }, [selectedChannel, handleScroll]);

  return (
    <Container flexDirection={'column'}>
      <ChatTalkAreaHeader selectedChannel={selectedChannel} />
      <ChatHistory
        chatHistMsgs={chatHistMsgs}
        scrollBottomRef={scrollBottomRef}
      />
      <ChatInput selectedChannel={selectedChannel} />
    </Container>
  );
};
