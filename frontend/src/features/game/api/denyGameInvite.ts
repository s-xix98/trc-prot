import { UserInfo } from '@/features/user/types/UserDto';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

export const useDenyGameInvite = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (srcUser: UserInfo) => {
    sessionSocketEmitter.emit('deny game-invitation', srcUser);
  };

  return { emit };
};
