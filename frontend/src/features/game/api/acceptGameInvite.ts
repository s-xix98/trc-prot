import { UserInfo } from '@/features/user/types/UserDto';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

export const useAcceptGameInvite = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (srcUser: UserInfo) => {
    sessionSocketEmitter.emit('accept game-invitation', srcUser);
  };

  return { emit };
};
