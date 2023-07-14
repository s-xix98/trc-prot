import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { joinChannelDto } from '../types/joinChannelDto';

export const useJoinChannel = () => {
  const userinfo = useAtomValue(userInfoAtom);
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }

    const dto: joinChannelDto = {
      userId: userinfo.id,
      chatRoomId: chatRoomId,
    };

    sessionSocketEmitter.emit('joinChannel', dto);
  };

  return { emit };
};
