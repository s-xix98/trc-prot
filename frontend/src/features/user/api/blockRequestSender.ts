import { useSessionSocketEmitter } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { friendshipDto } from '../types/FriendshipDto';

export const useBlockRequestSender = () => {
  const { currentUserInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (targetUserId: string) => {
    if (currentUserInfo === undefined) {
      console.log('currentUserInfo is undef');
      return;
    }

    const dto: friendshipDto = {
      userId: currentUserInfo.id,
      targetId: targetUserId,
    };

    sessionSocketEmitter.emit('blockUser', dto);
  };

  return { emit };
};
