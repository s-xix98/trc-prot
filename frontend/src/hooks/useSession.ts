import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { tokenStorage } from '@/utils/tokenStorage';
import {
  useLogin,
  useLogout,
  useVerifySession,
} from '@/features/user/api/userLogin';

import { useCurrentUser } from './useCurrentUser';

export const useSession = () => {
  const pathname = usePathname();
  const { automaticLogin } = useLogin();
  const { logout } = useLogout();
  const { verifySession } = useVerifySession();
  const { currentUserInfo } = useCurrentUser();

  useEffect(() => {
    if (pathname === '/2fa') {
      return;
    }

    // tokenStorage がない時は、/login に飛ぶはずなので、
    // /user/me に api 投げるまでもない
    if (tokenStorage.get() === null) {
      logout();
      return;
    }

    if (!currentUserInfo) {
      automaticLogin();
    } else {
      verifySession();
    }
  }, [pathname, currentUserInfo, automaticLogin, logout, verifySession]);
};
