import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useDelayedPageTransition = (path: string, delay: number) => {
  const router = useRouter();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push(path);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [path, delay, router]);
};
