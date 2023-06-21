import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { socket } from '@/socket';

import { sendMessageDto } from '../types/MessageDto';

const emitSendMessage = (
  userId: string,
  chatRoomId: string,
  content: string,
) => {
  const dto: sendMessageDto = {
    userId: userId,
    chatRoomId: chatRoomId,
    content: content,
  };

  socket.emit('sendMessage', dto);
};

export const useSendMessage = () => {
  const userinfo = useAtomValue(userInfoAtom);

  const emit = (chatRoomId: string, content: string) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitSendMessage(userinfo.id, chatRoomId, content);
  };

  return { emit };
};
