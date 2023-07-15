import { useSessionSocketEmitter } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { sendMessageDto } from '../types/MessageDto';

export const useSendMessage = () => {
  const { userInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, content: string) => {
    if (userInfo === undefined) {
      console.log('userInfo is undef');
      return;
    }

    const dto: sendMessageDto = {
      userId: userInfo.id,
      chatRoomId: chatRoomId,
      content: content,
    };

    sessionSocketEmitter.emit('sendMessage', dto);
  };

  return { emit };
};
