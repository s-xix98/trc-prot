import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { CreateChannelDto } from '../types/CreateChannelDto';

export const useCreateChannel = () => {
  const userinfo = useAtomValue(userInfoAtom);
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (
    roomName: string,
    password: string | undefined,
    isPrivate: boolean | undefined,
  ) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }

    const dto: CreateChannelDto = {
      roomName: roomName,
      userId: userinfo.id,
      password: password,
      isPrivate: isPrivate,
    };

    sessionSocketEmitter.emit('createChannel', dto);
  };

  return { emit };
};
