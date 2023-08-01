'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { tokenStorage } from '@/utils/tokenStorage';

// export default function Fa() {
//   const [qrcode, setqrcode] = useState<string>('');
//   const [enable, setEnable] = useState<string>('');
//   const [auth, setAuth] = useState<string>('');

//   const axios = useSessionAxios();
//   const sendGenerate = () => {
//     axios
//       .get('/auth/2fa/generate')
//       .then((res) => {
//         console.log(res);
//         setqrcode(res.data.base64);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const sendEnable = () => {
//     const dto = {
//       twoFaCode: enable,
//     };
//     axios
//       .post('/auth/2fa/enable', dto)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const sendAuth = () => {
//     const dto = {
//       twoFaCode: auth,
//     };

//     axios
//       .post('/auth/2fa/authentication', dto)
//       .then((res) => {
//         console.log(res);
//         const jwt = Buffer.from(res.data.jwt, 'base64').toString();
//         console.log(jwt);
//         tokenStorage.set(res.data.jwt);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const sendCheck = () => {
//     axios
//       .get('/auth/2fa/check')
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <div>
//       {qrcode && <Image src={qrcode} alt="QR Code" width={200} height={200} />}
//       <button onClick={sendGenerate}>2fa/generate</button>

//       <input
//         value={enable}
//         onChange={(event) => setEnable(event.target.value)}
//       />
//       <button onClick={sendEnable}>enable</button>

//       <input value={auth} onChange={(event) => setAuth(event.target.value)} />
//       <button onClick={sendAuth}>authentication</button>

//       <button onClick={sendCheck}>check</button>
//     </div>
//   );
// }

export default function TwoFa() {
  const [auth, setAuth] = useState<string>('');
  const router = useRouter();
  const axios = useSessionAxios();

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
    </>
  );
}
