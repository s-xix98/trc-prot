import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrentUser } from './useCurrentUser';

export const useRequireLogin = () => {
  const { userInfo } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (userInfo === undefined) {
      router.push('/login');
    }
  }, [userInfo, router]);
};
