import { useSessionSocketEmitter } from '@/hooks/useSocket';

import {
  InviteChatRoomDto,
  RejectChatInvitationDto,
} from '../types/InviteChatRoomDto';

export const useInviteChannel = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, targetId: string) => {
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
