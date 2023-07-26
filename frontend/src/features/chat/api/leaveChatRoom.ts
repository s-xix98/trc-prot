import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { LeaveRoomDto } from '../types/leaveRoomDto';

export const useLeaveChatRoom = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string) => {
    const dto: LeaveRoomDto = {
      chatRoomId: chatRoomId,
    };
    sessionSocketEmitter.emit('leaveChatRoom', dto);
  };

  return { emit };
};
