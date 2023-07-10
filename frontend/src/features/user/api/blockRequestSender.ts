import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';

import { friendshipDto } from '../types/FriendshipDto';
import { useSafeEmit } from '@/hooks/useSafeEmit';

// eslint-disable-next-line
const emitSendBlockRequest = (userId: string, targetUserId: string, emit:(eventName: string, ...data: any[]) => void) => {
  const dto: friendshipDto = { userId: userId, targetId: targetUserId };
  emit('blockUser', dto);
};

export const useBlockRequestSender = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const sEmit = useSafeEmit();

  const emit = (targetUserId: string) => {
    if (userInfo === undefined) {
      console.log('userinfo is undef');
      return;
    }

    emitSendBlockRequest(userInfo.id, targetUserId, sEmit);
  };

  return { emit };
};
