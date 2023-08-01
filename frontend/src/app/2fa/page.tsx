'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { tokenStorage } from '@/utils/tokenStorage';
import { useLogout } from '@/features/user/api/userLogin';

export default function TwoFa() {
  const [auth, setAuth] = useState<string>('');
  const router = useRouter();
  const axios = useSessionAxios();
  const { logout } = useLogout();

  const sendAuth = () => {
    const dto = {
      twoFaCode: auth,
    };

    axios
      .post('/auth/2fa/authentication', dto)
      .then((res) => {
        tokenStorage.set(res.data.jwt);
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <p>2Fa</p>
      <br />
      <input value={auth} onChange={(event) => setAuth(event.target.value)} />
      <button onClick={sendAuth}>authentication</button>
      <button
        onClick={() => {
          logout();
          router.push('/login');
        }}
      >
        logout
      </button>
    </>
  );
}
