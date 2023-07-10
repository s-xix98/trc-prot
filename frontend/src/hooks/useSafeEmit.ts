import { useAtomValue } from 'jotai';

import { socketAtom } from '@/stores/jotai';

export const useSafeEmit = () => {
  const socket = useAtomValue(socketAtom);

  // eslint-disable-next-line
  const safeEmit = (eventName: string, ...data: any[]) => {
    if (socket === undefined) {
      console.log('socket is undef');
      return;
    }

    socket.emit(eventName, ...data);
  };

  return safeEmit;
};
