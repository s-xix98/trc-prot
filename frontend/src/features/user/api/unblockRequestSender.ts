import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { friendshipDto } from '../types/FriendshipDto';

export const useUnblockRequestSender = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (targetUserId: string) => {
    const dto: friendshipDto = {
      targetId: targetUserId,
    };
    sessionSocketEmitter.emit('unblockUser', dto);
  };

  return { emit };
};
