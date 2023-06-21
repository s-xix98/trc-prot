import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';

import { tokenStorage } from '@/utils/tokenStorage';
import { BACKEND } from '@/constants';
class authError extends Error {
  constructor(e?: string) {
    super(e);
  }
}

const setAccessTokenForRequest = (req: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get();
  if (!token) {
    throw new authError('no session');
  }

  const authHeaders = `Bearer ${token}`;
  req.headers.Authorization = authHeaders;
  return req;
};

const handleUnauthorizedResponse = async (res: AxiosResponse) => {
  if (res.status === 401) {
    throw new authError('401');
  }
  return res;
};

export const useSessionAxios = () => {
  const router = useRouter();
  const customAxios = axios.create({
    baseURL: BACKEND,
  });

  // eslint-disable-next-line
  const routeOnAuthErr = (err: any) => {
    if (err instanceof authError) {
      router.push('/login');
    }
    throw err;
  };

  customAxios.interceptors.request.use(
    setAccessTokenForRequest,
    routeOnAuthErr,
  );
  customAxios.interceptors.response.use(
    handleUnauthorizedResponse,
    routeOnAuthErr,
  );

  return customAxios;
};
