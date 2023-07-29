import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { RoomMemberRestrictionDto } from '../types/chatChannelDto';

export const useBanRoomMember = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, targetId: string, banMinutes: number) => {
    const now = new Date();
    const endedAt = new Date(now.getTime() + banMinutes * 60 * 1000);

    const dto: RoomMemberRestrictionDto = {
      chatRoomId: chatRoomId,
      targetId: targetId,
      endedAt: endedAt,
    };

    sessionSocketEmitter.emit('banRoomMember', dto);
  };

  return { emit };
};
