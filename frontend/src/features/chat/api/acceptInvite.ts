import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { AcceptChatInvitationDto } from '../types/InviteChatRoomDto';

export const useAcceptChatInvitation = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, inviterId: string) => {
    const dto: AcceptChatInvitationDto = {
      chatRoomId: chatRoomId,
      inviterId: inviterId,
    };
    sessionSocketEmitter.emit('acceptChatInvitation', dto);
  };

  return { emit };
};
