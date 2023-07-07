import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { socket } from '@/socket';

import { CreateChannelDto } from '../types/CreateChannelDto';

const emitCreateChannel = (
  userId: string,
  roomName: string,
  password: string | undefined,
  isPrivate: boolean | undefined,
) => {
  const dto: CreateChannelDto = {
    roomName: roomName,
    userId: userId,
    password: password,
    isPrivate: isPrivate,
  };
  socket.emit('createChannel', dto);
};

export const useCreateChannel = () => {
  const userinfo = useAtomValue(userInfoAtom);

  const emit = (
    roomName: string,
    password: string | undefined,
    isPrivate: boolean | undefined,
  ) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitCreateChannel(userinfo.id, roomName, password, isPrivate);
  };

  return { emit };
};
