'use client';

import { useSessionAxios } from "@/hooks/useSessionAxios";
import { useState } from "react";
import Image from "next/image";

export default function Fa() {
  const [qrcode, setqrcode] = useState<string>('');

  const axios = useSessionAxios();
  const sendGenerate = () => {
    axios.get('/auth/2fa/generate').then((res) => {
      console.log(res);
      setqrcode(res.data.base64);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div>
        {qrcode &&  <Image src={qrcode} alt="QR Code"  width={200} height={200}/>}
        <button onClick={sendGenerate}>2fa/generate</button>

    </div>
  );
}