import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { RoomMemberRestrictionDto } from '../types/chatChannelDto';

export const useMuteRoomMember = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, targetId: string, muteMinutes: number) => {
    const dto: RoomMemberRestrictionDto = {
      chatRoomId: chatRoomId,
      targetId: targetId,
      duration: muteMinutes,
    };

    sessionSocketEmitter.emit('muteRoomMember', dto);
  };

  return { emit };
};
