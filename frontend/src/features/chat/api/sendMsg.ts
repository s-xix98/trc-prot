import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';

import { sendMessageDto } from '../types/MessageDto';
import { useSafeEmit } from '@/hooks/useSafeEmit';

const emitSendMessage = (
  userId: string,
  chatRoomId: string,
  content: string,
  // eslint-disable-next-line
  emit:(eventName: string, ...data: any[]) => void,
) => {
  const dto: sendMessageDto = {
    userId: userId,
    chatRoomId: chatRoomId,
    content: content,
  };

  emit('sendMessage', dto);
};

export const useSendMessage = () => {
  const userinfo = useAtomValue(userInfoAtom);
  const sEmit = useSafeEmit();

  const emit = (chatRoomId: string, content: string) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitSendMessage(userinfo.id, chatRoomId, content, sEmit);
  };

  return { emit };
};
