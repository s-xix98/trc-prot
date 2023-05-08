'use client';

import { useEffect } from 'react';

import { socket } from '@/socket';

// eslint-disable-next-line
export const useSocket = (ev: string, listener: (...args: any[]) => void) => {
  useEffect(() => {
    socket.on(ev, listener);

    return () => {
      socket.off(ev, listener);
    };
  }, [ev, listener]);
};
