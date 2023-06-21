import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import { useRouter } from 'next/navigation';

import { tokenStorage } from '@/utils/tokenStorage';
import { BACKEND } from '@/constants';
class authError extends Error {
  constructor(e?: string) {
    super(e);
  }
}

// eslint-disable-next-line
function isAxiosError(error: any): error is AxiosError {
  return !!error.isAxiosError;
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

const customAxios = axios.create({
  baseURL: BACKEND,
});

export const useSessionAxios = () => {
  const router = useRouter();

  // eslint-disable-next-line
  const routeOnAuthErr = (err: any) => {
    if (isAxiosError(err)) {
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
