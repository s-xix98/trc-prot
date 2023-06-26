import axios, { InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';

import { tokenStorage } from '@/utils/tokenStorage';
import { BACKEND } from '@/constants';

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

  customAxios.interceptors.request.use(setAccessTokenForRequest);
  // customAxios.interceptors.response.use();

  return customAxios;
};
