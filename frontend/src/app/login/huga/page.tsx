'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { userInfoAtom } from '@/stores/jotai';

import { userLogin } from '../../../features/user/api/userLogin';

export default function Huga() {
  const router = useRouter();
  const [, setUserInfo] = useAtom(userInfoAtom);

  useEffect(() => {
    userLogin('huga@example.com', 'hugahuga', setUserInfo);
    router.push('/');
  }, [router, setUserInfo]);

  return <h1>Huga</h1>;
}
