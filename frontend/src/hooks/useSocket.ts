'use client';

import { useEffect } from 'react';
import { useAtomValue } from 'jotai';

import { socketAtom } from '@/stores/jotai';

export const useSessionSocket = (
  ev: string,
  // eslint-disable-next-line
  listener: (...args: any[]) => void,
) => {
  const sessionSocket = useAtomValue(socketAtom);

  useEffect(() => {
    if (sessionSocket === undefined) {
      return;
    }

    sessionSocket.on(ev, listener);

    return () => {
      sessionSocket.off(ev, listener);
    };
  }, [ev, listener, sessionSocket]);
};
