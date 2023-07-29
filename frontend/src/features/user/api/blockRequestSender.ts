import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { friendshipDto } from '../types/FriendshipDto';

export const useBlockRequestSender = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (targetUserId: string) => {
    const dto: friendshipDto = {
      targetId: targetUserId,
    };

    sessionSocketEmitter.emit('blockUser', dto);
  };

  return { emit };
};
