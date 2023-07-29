import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { friendshipDto } from '../types/FriendshipDto';

export const useFriendRequestSender = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (targetUserId: string) => {
    const dto: friendshipDto = {
      targetId: targetUserId,
    };
    sessionSocketEmitter.emit('friendRequest', dto);
  };

  return { emit };
};
