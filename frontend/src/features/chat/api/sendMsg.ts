import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { sendMessageDto } from '../types/MessageDto';

export const useSendMessage = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, content: string) => {
    const dto: sendMessageDto = {
      chatRoomId: chatRoomId,
      content: content,
    };

    sessionSocketEmitter.emit('sendMessage', dto);
  };

  return { emit };
};
