import { useSessionSocketEmitter } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { CreateChannelDto } from '../types/CreateChannelDto';

export const useCreateChannel = () => {
  const { currentUserInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (
    roomName: string,
    password: string | undefined,
    isPrivate: boolean | undefined,
  ) => {
    if (currentUserInfo === undefined) {
      console.log('currentUserInfo is undef');
      return;
    }

    const dto: CreateChannelDto = {
      roomName: roomName,
      userId: currentUserInfo.id,
      password: password,
      isPrivate: isPrivate,
    };

    sessionSocketEmitter.emit('createChannel', dto);
  };

  return { emit };
};
