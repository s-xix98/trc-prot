import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';

import { useSafeEmit } from '@/hooks/useSafeEmit';
import { joinChannelDto } from '../types/joinChannelDto';

// eslint-disable-next-line
const emitJoinChannel = (userId: string, chatRoomId: string, emit: (eventName: string, ...data: any[]) => void) => {
  const dto: joinChannelDto = {
    userId,
    chatRoomId,
  };

  emit('joinChannel', dto);
};

export const useJoinChannel = () => {
  const userinfo = useAtomValue(userInfoAtom);
  const sEmit = useSafeEmit();

  const emit = (chatRoomId: string) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitJoinChannel(userinfo.id, chatRoomId, sEmit);
  };

  return { emit };
};
