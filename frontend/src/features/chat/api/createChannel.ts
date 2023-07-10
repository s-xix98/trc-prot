import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { useSafeEmit } from '@/hooks/useSafeEmit';

import { CreateChannelDto } from '../types/CreateChannelDto';

const emitCreateChannel = (
  userId: string,
  roomName: string,
  password: string | undefined,
  isPrivate: boolean | undefined,
  // eslint-disable-next-line
  emit: (eventName: string, ...data: any[]) => void,
) => {
  const dto: CreateChannelDto = {
    roomName: roomName,
    userId: userId,
    password: password,
    isPrivate: isPrivate,
  };
  emit('createChannel', dto);
};

export const useCreateChannel = () => {
  const userinfo = useAtomValue(userInfoAtom);
  const sEmit = useSafeEmit();

  const emit = (
    roomName: string,
    password: string | undefined,
    isPrivate: boolean | undefined,
  ) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitCreateChannel(userinfo.id, roomName, password, isPrivate, sEmit);
  };

  return { emit };
};
