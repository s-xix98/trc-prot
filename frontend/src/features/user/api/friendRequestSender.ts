import { useAtomValue } from 'jotai';

import { useSafeEmit } from '@/hooks/useSafeEmit';
import { userInfoAtom } from '@/stores/jotai';

import { friendshipDto } from '../types/FriendshipDto';

const emitSendFriendRequest = (
  userId: string,
  targetUserId: string,
  // eslint-disable-next-line
  emit: (eventName: string, ...data: any[]) => void,
) => {
  const dto: friendshipDto = { userId: userId, targetId: targetUserId };
  emit('friendRequest', dto);
};

export const useFriendRequestSender = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const sEmit = useSafeEmit();

  const emit = (targetUserId: string) => {
    if (userInfo === undefined) {
      console.log('userinfo is undef');
      return;
    }

    emitSendFriendRequest(userInfo.id, targetUserId, sEmit);
  };

  return { emit };
};
