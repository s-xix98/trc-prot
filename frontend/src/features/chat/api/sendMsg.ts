import { useSessionSocketEmitter } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { sendMessageDto } from '../types/MessageDto';

export const useSendMessage = () => {
  const { currentUserInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, content: string) => {
    if (currentUserInfo === undefined) {
      console.log('currentUserInfo is undef');
      return;
    }

    const dto: sendMessageDto = {
      userId: currentUserInfo.id,
      chatRoomId: chatRoomId,
      content: content,
    };

    sessionSocketEmitter.emit('sendMessage', dto);
  };

  return { emit };
};
