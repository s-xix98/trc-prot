import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { CreateChannelDto } from '../types/CreateChannelDto';

export const useCreateChannel = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (
    roomName: string,
    password: string | undefined,
    isPrivate: boolean | undefined,
  ) => {
    const dto: CreateChannelDto = {
      roomName: roomName,
      password: password,
      isPrivate: isPrivate,
    };

    sessionSocketEmitter.emit('createChannel', dto);
  };

  return { emit };
};
