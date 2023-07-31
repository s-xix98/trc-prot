import { UserInfo } from '@/features/user/types/UserDto';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

export const useInviteGame = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (destUser: UserInfo) => {
    sessionSocketEmitter.emit('invite game', destUser);
  };

  return { emit };
};
