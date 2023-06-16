import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrentUser } from './useCurrentUser';

// userInfo :   undefined -> login page
// userInfo : ! undefined -> top page

export const useRequireLogin = () => {
  const { userInfo } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (userInfo === undefined) {
      router.push('/login');
    }
  }, [userInfo, router]);
};

export const useRedirectToHome = () => {
  const { userInfo } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (userInfo !== undefined) {
      router.push('/');
    }
  }, [userInfo, router]);
};