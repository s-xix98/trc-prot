import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

import {
  InviteChatRoomDto,
  RejectChatInvitationDto,
} from '../types/InviteChatRoomDto';

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

export const useRejectChatInvitation = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, inviterId: string) => {
    const dto: RejectChatInvitationDto = {
      chatRoomId: chatRoomId,
      inviterId: inviterId,
    };

    sessionSocketEmitter.emit('rejectChatInvitation', dto);
  };

  return { emit };
};
