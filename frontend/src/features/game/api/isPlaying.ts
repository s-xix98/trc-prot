import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

export const useIsPlaying = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();
  const { currentUserInfo } = useCurrentUser();

  const emit = () => {
    if (currentUserInfo === undefined) {
      console.log('currentUserInfo is undef');
      return;
    }
    sessionSocketEmitter.emit('is playing', currentUserInfo);
  };

  return { emit };
};
