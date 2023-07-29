import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { joinChannelDto } from '../types/joinChannelDto';

export const useJoinChannel = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, password?: string) => {
    const dto: joinChannelDto = {
      chatRoomId: chatRoomId,
      password: password,
    };

    sessionSocketEmitter.emit('joinChannel', dto);
  };

  return { emit };
};
