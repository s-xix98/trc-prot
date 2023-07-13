import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { sendMessageDto } from '../types/MessageDto';

export const useSendMessage = () => {
  const userinfo = useAtomValue(userInfoAtom);
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, content: string) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }

    const dto: sendMessageDto = {
      userId: userinfo.id,
      chatRoomId: chatRoomId,
      content: content,
    };

    sessionSocketEmitter.emit('sendMessage', dto);
  };

  return { emit };
};
