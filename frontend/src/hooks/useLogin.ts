import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

import { useCurrentUser } from './useCurrentUser';

// userInfo :   undefined -> login page
// userInfo : ! undefined -> top page

export const useRedirectToHome = () => {
  const { userInfo } = useCurrentUser();
  const router = useRouter();

  useLayoutEffect(() => {
    if (userInfo !== undefined) {
      router.push('/');
    }
  }, [userInfo, router]);
};
