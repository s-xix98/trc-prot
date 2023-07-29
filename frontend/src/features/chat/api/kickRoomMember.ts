import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { KickRoomMemberDto } from '../types/KickRoomMemberDto';
export const useKickRoomMember = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, targetId: string) => {
    const dto: KickRoomMemberDto = {
      chatRoomId: chatRoomId,
      targetId: targetId,
    };
    sessionSocketEmitter.emit('kickRoomMember', dto);
  };

  return { emit };
};
