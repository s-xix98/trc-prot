import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { socket } from '@/socket';

import { CreateChannelDto } from '../types/CreateChannelDto';

const emitCreateChannel = (roomName: string, userId: string) => {
  const dto: CreateChannelDto = {
    roomName,
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
    emitCreateChannel(roomName, userinfo.id);
  };

  return { emit };
};
