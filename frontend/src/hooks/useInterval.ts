import { useEffect } from 'react';

export const useInterval = (callback: () => void, delay?: number) => {
  useEffect(() => {
    const interval = setInterval(() => callback(), delay || 0);
    return () => clearInterval(interval);
  }, [callback, delay]);
};
