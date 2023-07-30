import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { RoomMemberRestrictionDto } from '../types/chatChannelDto';

export const useMuteRoomMember = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, targetId: string, muteMinutes: number) => {
    const now = new Date();
    const endedAt = new Date(now.getTime() + muteMinutes * 60 * 1000);

    const dto: RoomMemberRestrictionDto = {
      chatRoomId: chatRoomId,
      targetId: targetId,
      endedAt: endedAt,
    };

    sessionSocketEmitter.emit('muteRoomMember', dto);
  };

  return { emit };
};
