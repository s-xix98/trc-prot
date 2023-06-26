import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { BACKEND } from '@/constants';
import { userInfoAtom } from '@/stores/jotai';
import { tokenStorage } from '@/utils/tokenStorage';

import { UserInfo } from '../features/user/types/UserDto';

export const useSession = () => {
  const axios = useSessionAxios();
  const setUserInfo = useSetAtom(userInfoAtom);
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [axios, setUserInfo, pathname, router]);
};
