import { useAtomValue } from 'jotai';

import { socket } from '@/socket';
import { userInfoAtom } from '@/stores/jotai';

import { friendshipDto } from '../types/FriendshipDto';

const emitSendBlockRequest = (userId: string, targetUserId: string) => {
  const dto: friendshipDto = { userId: userId, targetId: targetUserId };
  socket.emit('blockUser', dto);
};

export const useBlockRequestSender = () => {
  const userInfo = useAtomValue(userInfoAtom);

  const emit = (targetUserId: string) => {
    if (userInfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitSendBlockRequest(userInfo.id, targetUserId);
  };

  return { emit };
};
