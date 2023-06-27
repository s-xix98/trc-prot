import { useAtomValue } from 'jotai';

import { socket } from '@/socket';
import { userInfoAtom } from '@/stores/jotai';

import { friendshipDto } from '../types/FriendshipDto';

const emitSendFriendRequest = (userId: string, targetUserId: string) => {
  const dto: friendshipDto = { userId: userId, targetId: targetUserId };
  socket.emit('friendRequest', dto);
};

export const useFriendRequestSender = () => {
  const userInfo = useAtomValue(userInfoAtom);

  const emit = (targetUserId: string) => {
    if (userInfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitSendFriendRequest(userInfo.id, targetUserId);
  };

  return { emit };
};
