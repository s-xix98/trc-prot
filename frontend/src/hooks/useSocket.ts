'use client';

import { useEffect } from 'react';
import { socketAtom } from '@/stores/jotai';
import { useAtomValue } from 'jotai';

// eslint-disable-next-line
export const useSocket = (ev: string, listener: (...args: any[]) => void) => {
  const socket = useAtomValue(socketAtom);

  useEffect(() => {
    if (socket === undefined){
      return;
    }

    socket.on(ev, listener);

    return () => {
      socket.off(ev, listener);
    };
  }, [ev, listener, socket]);
};
