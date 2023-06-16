import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useRequireLogin = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);
};
