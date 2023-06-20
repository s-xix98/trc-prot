import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { socket } from '@/socket';

import { CreateChannelDto } from '../types/CreateChannelDto';

const emitCreateChannel = (userId: string, roomName: string) => {
  const dto: CreateChannelDto = {
    roomName: roomName,
    userId: userId,
  };
  socket.emit('createChannel', dto);
};

export const useCreateChannel = () => {
  const userinfo = useAtomValue(userInfoAtom);

  const emit = (roomName: string) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitCreateChannel(userinfo.id, roomName);
  };

  return { emit };
};
