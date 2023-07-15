import { useSessionSocketEmitter } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { CreateChannelDto } from '../types/CreateChannelDto';

export const useCreateChannel = () => {
  const { userInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (
    roomName: string,
    password: string | undefined,
    isPrivate: boolean | undefined,
  ) => {
    if (userInfo === undefined) {
      console.log('userInfo is undef');
      return;
    }

    const dto: CreateChannelDto = {
      roomName: roomName,
      userId: userInfo.id,
      password: password,
      isPrivate: isPrivate,
    };

    sessionSocketEmitter.emit('createChannel', dto);
  };

  return { emit };
};
