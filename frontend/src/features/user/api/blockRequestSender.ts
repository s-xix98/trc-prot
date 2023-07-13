import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { friendshipDto } from '../types/FriendshipDto';

export const useBlockRequestSender = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (targetUserId: string) => {
    if (userInfo === undefined) {
      console.log('userinfo is undef');
      return;
    }

    const dto: friendshipDto = { userId: userInfo.id, targetId: targetUserId };

    sessionSocketEmitter.emit('blockUser', dto);
  };

  return { emit };
};
