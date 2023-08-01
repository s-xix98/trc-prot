import { UserInfo } from '@/features/user/types/UserDto';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { GameOptionDto, UserGameOption } from '../types/gameOptionDto';

export const useInviteGame = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (destUser: UserInfo, gameOpt: GameOptionDto) => {
    const dto: UserGameOption = {
      user: destUser,
      opt: gameOpt,
    };
    sessionSocketEmitter.emit('invite game', dto);
  };

  return { emit };
};
