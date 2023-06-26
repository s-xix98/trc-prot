import axios, { InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';

import { tokenStorage } from '@/utils/tokenStorage';
import { BACKEND } from '@/constants';
import { useSetAtom } from 'jotai';
import { userInfoAtom } from '@/stores/jotai';

const setAccessTokenForRequest = (req: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get();
  if (token) {
    const authHeaders = `Bearer ${token}`;
    req.headers.Authorization = authHeaders;
  }
  return req;
};

const customAxios = axios.create({
  baseURL: BACKEND,
});

export const useSessionAxios = () => {
  const router = useRouter();
  const setUserInfo = useSetAtom(userInfoAtom);

  useEffect(() => {
    customAxios.interceptors.request.use(setAccessTokenForRequest);
    customAxios.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        // 401 の時のみ login に飛ばす
        if (error?.response?.status === 401) {
          // TODO : login に飛ばす処理統一させる
          setUserInfo(undefined);
          tokenStorage.remove();
          router.push('/login');
        }

        return Promise.reject(error);
      },
    );
  }, [setUserInfo, router]);

  return customAxios;
};
