import axios, { InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { tokenStorage } from '@/utils/tokenStorage';
import { BACKEND } from '@/constants';
import { useLogout } from '@/features/user/api/userLogin';

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
  const { logout } = useLogout();

  useEffect(() => {
    customAxios.interceptors.request.use(setAccessTokenForRequest);
    customAxios.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        // 401 の時のみ login に飛ばす
        if (error?.response?.status === 401) {
          logout();
        }

        return Promise.reject(error);
      },
    );
  }, [router, logout]);

  return customAxios;
};
