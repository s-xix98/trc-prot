import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { InviteChatRoomDto } from '../types/InviteChatRoomDto';

export const useInviteChannel = () => {
  const { currentUserInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, targetId: string) => {
    if (currentUserInfo === undefined) {
      console.log('currentUserInfo is undef');
      return;
    }

    const dto: InviteChatRoomDto = {
      chatRoomId: chatRoomId,
      targetId: targetId,
    };

    sessionSocketEmitter.emit('inviteChatRoom', dto);
  };

  return { emit };
};
