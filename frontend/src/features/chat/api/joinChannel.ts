import { useSessionSocketEmitter } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { joinChannelDto } from '../types/joinChannelDto';

export const useJoinChannel = () => {
  const { userInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string) => {
    if (userInfo === undefined) {
      console.log('userInfo is undef');
      return;
    }

    const dto: joinChannelDto = {
      userId: userInfo.id,
      chatRoomId: chatRoomId,
    };

    sessionSocketEmitter.emit('joinChannel', dto);
  };

  return { emit };
};
