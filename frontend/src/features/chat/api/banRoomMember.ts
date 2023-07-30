import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { RoomMemberRestrictionDto } from '../types/chatChannelDto';

export const useBanRoomMember = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, targetId: string, banMinutes: number) => {
    const dto: RoomMemberRestrictionDto = {
      chatRoomId: chatRoomId,
      targetId: targetId,
      duration: banMinutes,
    };

    sessionSocketEmitter.emit('banRoomMember', dto);
  };

  return { emit };
};
