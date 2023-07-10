import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { BACKEND } from '@/constants';
import { socketAtom, userInfoAtom } from '@/stores/jotai';
import { tokenStorage } from '@/utils/tokenStorage';

import { UserInfo } from '../features/user/types/UserDto';

export const useSession = () => {
  const axios = useSessionAxios();
  const setUserInfo = useSetAtom(userInfoAtom);
  const setSocket = useSetAtom(socketAtom);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // tokenStorage がない時は、/login に飛ぶはずなので、
    // /user/me に api 投げるまでもない
    if (tokenStorage.get() === null) {
      // TODO : login に飛ばす処理統一させる
      setUserInfo(undefined);
      router.push('/login');
      return;
    }
    axios
      .get<UserInfo>(BACKEND + '/user/me')
      .then((res) => {
        setUserInfo(res.data);
        setSocket(io(BACKEND, { auth: { token: tokenStorage.get() } }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [axios, setUserInfo, setSocket, pathname, router]);
};
