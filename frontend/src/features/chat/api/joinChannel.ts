import { useSessionSocketEmitter } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { joinChannelDto } from '../types/joinChannelDto';

export const useJoinChannel = () => {
  const { currentUserInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (chatRoomId: string, password?: string) => {
    if (currentUserInfo === undefined) {
      console.log('currentUserInfo is undef');
      return;
    }

    const dto: joinChannelDto = {
      userId: currentUserInfo.id,
      chatRoomId: chatRoomId,
      password: password,
    };

    sessionSocketEmitter.emit('joinChannel', dto);
  };

  return { emit };
};
