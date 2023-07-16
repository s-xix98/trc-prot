import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

import { useCurrentUser } from './useCurrentUser';

// currentUserInfo :   undefined -> login page
// currentUserInfo : ! undefined -> top page

export const useRedirectToHome = () => {
  const { currentUserInfo } = useCurrentUser();
  const router = useRouter();

  useLayoutEffect(() => {
    if (currentUserInfo !== undefined) {
      router.push('/');
    }
  }, [currentUserInfo, router]);
};
