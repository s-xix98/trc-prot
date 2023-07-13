'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useSessionAxios } from '@/hooks/useSessionAxios';

export default function Fa() {
  const [qrcode, setqrcode] = useState<string>('');
  const [enable, setEnable] = useState<string>('');

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

  const sendEnable = () => {
    const dto = {
      twoFaCode: enable,
    };
    axios
      .post('/auth/2fa/enable', dto)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {qrcode && <Image src={qrcode} alt="QR Code" width={200} height={200} />}
      <button onClick={sendGenerate}>2fa/generate</button>

      <input
        value={enable}
        onChange={(event) => setEnable(event.target.value)}
      />
      <button onClick={sendEnable}>enable</button>
    </div>
  );
}
