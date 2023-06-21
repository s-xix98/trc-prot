import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';
import { socket } from '@/socket';

import { joinChannelDto } from '../types/joinChannelDto';

const emitJoinChannel = (userId: string, chatRoomId: string) => {
  const dto: joinChannelDto = {
    userId,
    chatRoomId,
  };
  socket.emit('joinChannel', dto);
};

export const useJoinChannel = () => {
  const userinfo = useAtomValue(userInfoAtom);

  const emit = (chatRoomId: string) => {
    if (userinfo === undefined) {
      console.log('userinfo is undef');
      return;
    }
    emitJoinChannel(userinfo.id, chatRoomId);
  };

  return { emit };
};
