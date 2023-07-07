'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { tokenStorage } from "@/utils/tokenStorage";

export default function Fa() {
  const [qrcode, setqrcode] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [auth, setAuth] = useState<string>('');

  const axios = useSessionAxios();
  const sendGenerate = () => {
    axios
      .get('/auth/2fa/generate')
      .then((res) => {
        console.log(res);
        setqrcode(res.data.base64);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendConfirm = () => {
    const dto = {
      twoFaCode: confirm,
    }
    axios.post('/auth/2fa/confirm', dto).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  };

  const sendAuth = () => {
    const dto = {
      twoFaCode: auth,
    }
    axios.post('/auth/2fa/authentication', dto).then((res) => {
      console.log(res);
      tokenStorage.set(res.data.jwt);
    }).catch((err) => {
      console.log(err);
    });
  };

  const sendCheck = () => {
    axios.get('/auth/2fa/check').then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div>
      {qrcode && <Image src={qrcode} alt="QR Code" width={200} height={200} />}
      <button onClick={sendGenerate}>2fa/generate</button>
      <input
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
        <button onClick={sendConfirm}>confirm</button>

        <input
          value={auth}
          onChange={(event) => setAuth(event.target.value)}
        />
        <button onClick={sendAuth}>authentication</button>
        <button onClick={sendCheck}>check</button>

    </div>
  );
}
