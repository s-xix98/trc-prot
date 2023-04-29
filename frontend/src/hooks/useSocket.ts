import { useEffect } from 'react';

import { socket } from '@/socket';

// TODO : できれば any 使いたくないが どう書けばいいんだ？
// eslint-disable-next-line
export const useSocket = (ev: string, listener: (...args: any[]) => void) => {
  useEffect(() => {
    socket.on(ev, listener);

    return () => {
      socket.off(ev, listener);
    };
  }, [ev, listener]);
};
